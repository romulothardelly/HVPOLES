import * as THREE from 'three';
import * as MC from './minecube_library.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MapControls } from 'three/addons/controls/MapControls.js';

            



let camera, controls, scene, renderer, perspective, ortho;
let clickableObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


			init();
			//render(); // remove when using next line for animation loop (requestAnimationFrame)
			

function init() {
  
    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');
    // scene.fog = new THREE.FogExp2(0xcccc00, 0.002);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    /////////////////////////////////////////////////
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    ///////////////////////////////////////////////////////
    let divdraw3d = document.getElementById("draw3d")

    renderer.setSize(divdraw3d.clientWidth, divdraw3d.clientHeight);
    renderer.useLegacyLights = false;
    document.getElementById("draw3d").appendChild(renderer.domElement)

    //Perspective camera creation/////////////////////////////////////
    perspective = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    perspective.position.set(10000, 10000, 10000);
    perspective.lookAt(0, 0, 0)
    perspective.up.set(0, 1, 0);
    
    // Orthographic Camera
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 20000;
    

    
   

    camera = perspective


    // Control creation

    controls = new MapControls(camera, renderer.domElement);
    
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05; 
    controls.screenSpacePanning = false;
 
    //controls.minDistance = 1;
    controls.maxDistance = 100000;
 
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0; 
    controls.target = new THREE.Vector3(4000, 0, 0);


    

    function perspective_control() {
        controls.dispose(); // Remove listeners do antigo controle
        controls = new MapControls(camera, renderer.domElement);

        controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,   // Zoom with middle mouse
            RIGHT: THREE.MOUSE.ROTATE                // Disable right-click action
        };
        
        controls.enableDamping = true;
         controls.dampingFactor = 0.5;
        controls.screenSpacePanning = false;
        // controls.screenSpacePanning = true;
        

        //////////////////////
        controls.maxDistance = 100000; 
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = 0; 
        controls.target = new THREE.Vector3(4000, 0, 0);
        ////////////////////
       
        controls.enableZoom = true;
        controls.enablePan = true;        

        // Ajuste o zoom para ortográfica
        controls.minZoom = 0.1;
        controls.maxZoom = 10;
        //controls.minDistance = 1;
 
        controls.update();
    }





    ////options creating//////
    const options = {
        cameraType: 'Perspective',
        Objetos:''
    };

    const gui = new GUI();
    gui.add(options, 'cameraType', ['Perspective']).onChange((value) => {
        if (value === 'Perspective') {
            //alert('Perspective')
            camera = perspective;
            perspective_control()
        }      // Atualizar controles para a nova câmera
        
    });


    

     


    //Axis creation///////////////////////
    //x  in blue
    //z in red
    //y in green
    const myaxis = new MC.Axis(5000)
    scene.add(...myaxis.lines) 
    



    
// Create a plane to represent the ground
    const plane = MC.createPlane(50000, 50000);
    //permite shwadow
    plane.receiveShadow = true;
    plane.name = "Ground";
    //plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
   
   
    //scene.add(MC.createCube(0, 0, 0, 0x00ff00, 1000, 1000, 1000, true))
    const group = new THREE.Group();
    for (let y = 0; y < 5; y++) {
        for (let i = 0+y; i < 10-y; i++) {
            for (let j = 0+y; j < 10-y; j++) {
                const cube = MC.createCubeTexture(i * 1000, y*1000, j * 1000, 0x00ff00, 1000, 1000, 1000, true);
                group.add(cube);
                
            }
        }
    }
    scene.add(group);
    const group2 = group.clone(true);
    group2.position.set(0, 0, 10000);
    scene.add(group2);

    
    

    


    ////////



    ////////////////////////
/*
    const objectsFolder = gui.addFolder('Select the pole');
    poles.children.forEach((poste) => {
        const folder = objectsFolder.addFolder(poste.name);
        poste.visible = false;

        folder.add(poste, 'visible').name('Vísible').onChange((visible) => {
            poste.visible = visible;
        });

        const data = [
        ["Sidewalk width", "1,2 m"],
        ["Service zone width",(poste.d1 / 10).toFixed(0) + " cm"],
            ["Total sidewalk width", ((poste.d1 + 1200) / 1000).toFixed(1) + " m"]
        ];
        
        data.forEach((item) => {
        const [name, value] = item;
        const c = folder.add({ [name]: value }, name).name(name);
        c.disable(); // Desabilita a edição do valor
        });
        folder.close()
         // Set visible to true by default
        
        //close the folder
        

        });

        
*/








    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity
    //scene.add(ambientLight);
    
    //const raycaster = new THREE.Raycaster();
    //const mouse = new THREE.Vector2();


    window.addEventListener( 'resize', onWindowResize );    

    animate();
}



function onWindowResize() {
    let divdraw3d = document.getElementById("draw3d")
    camera.aspect=divdraw3d.clientWidth/divdraw3d.clientHeight
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( divdraw3d.clientWidth,divdraw3d.clientHeight);
    console.log(camera.position)

}

function animate() {

    requestAnimationFrame( animate );

    //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();

}

function render() {
//requestAnimationFrame(render);
    renderer.render( scene, camera);
    

}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
     // console.log(intersects[0])
        const mesh = intersects[0].object;
        alert(mesh.getinfo());
        
       
 
  }else {
    ////console.log("No clickable object found at the clicked position.");
  }
}
window.addEventListener('click', onClick, false);




