import * as THREE from 'three';
import * as TH3D from 'TH3D';
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

    ortho = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,  // left
        frustumSize * aspect / 2,  // right
        frustumSize / 2,           // top
        -frustumSize / 2,           // bottom
        1,                          // near
        100000                      // far
    );

    ortho.position.set(10000, 10000, 10000);
    ortho.lookAt(0, 0, 0);
    ortho.up.set(0, 1, 0);  
   

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


    function orto_control(p={}) {
        const x = p.x ?? 0
        const y = p.y ?? 0
        const z = p.z ?? 0


        controls.dispose(); // Remove listeners do antigo controle
        controls = new MapControls(camera, renderer.domElement);

        controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,   // Zoom with middle mouse
            RIGHT: null                  // Disable right-click action
            };
        controls.enableDamping = true;
        controls.screenSpacePanning = true;
        controls.dampingFactor = 0.05;

        // Para câmera ortográfica, esses dois parâmetros não devem limitar a rotação
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;
        
        //ontrols.screenSpacePanning = false;

        // Ajuste o zoom para ortográfica
        controls.minZoom = 0.1;
        controls.maxZoom = 10;
        //controls.minDistance = 1;
        controls.maxDistance = 100000;
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = 0;
        controls.target = new THREE.Vector3(x, y, z);
        controls.update();
    }

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
    gui.add(options, 'cameraType', ['Perspective', 'Orthographic', 'Front1','Front2', 'X- view', 'X+ view']).onChange((value) => {
        if (value === 'Perspective') {
            //alert('Perspective')
            camera = perspective;
            perspective_control()
        } else if (value === 'Orthographic') {
            ortho.position.set(10000, 10000, 10000);
            ortho.lookAt(0, 0, 0);
            ortho.up.set(0, 1, 0);
            camera = ortho;
             orto_control();
        } else if (value == "Front1") {
            ortho.position.set(0, 0, 10000);
            ortho.up.set(0, 1, 0);
            camera = ortho;
            orto_control();
            
        } else if (value == "Front2") {
            ortho.position.set(0, 0, 2000);
            ortho.up.set(0, 1, 0);
            camera = ortho;
            orto_control();
            
        }
        else if (value == "X- view") {
            ortho.position.set(-10000, 0, 0);
            ortho.up.set(0, 1, 0);
            camera = ortho;
             orto_control();
            
        } else if (value == "X+ view") {
            ortho.position.set(0, 0, 2000);
            ortho.lookAt(0, 0, 0   );
            ortho.up.set(0, 1, 0);
            camera = ortho;
            orto_control();
            
        }

        


        // Atualizar controles para a nova câmera
        
    });


    

     


    //Axis creation///////////////////////
    //x  in blue
    //z in red
    //y in green
    const myaxis = new TH3D.Axis(5000)
    scene.add(...myaxis.lines) 
    



    
// Create a plane to represent the ground
    const plane= TH3D.createPlane(50000, 50000);
    scene.add(plane);
   




  

    let poles = new THREE.Group();
    poles.name = "Poles";

    poles.addPole = function (pole) {        
        const g = new THREE.Group()
        g.name = pole.description;
        const x = pole.position.x;

        
        

        g.add(pole);
        const i = g.children.length-1; // pega o índice do último poste adicionado
        //console.log(g.children[i])
        const sidewalk_width = 1200
        //console.log(this.children[i])
        const sidewalk_height = 150;
        const sidewalk_length = 3000;
        const wall_height = 2000;
        let sidewalk = TH3D.createBox(0, x, 0, sidewalk_width / 2, 0x00ff00, sidewalk_height, sidewalk_width, sidewalk_length)
        sidewalk.description = "Calçada"
        const pole_burial_depth=g.children[i].height * 0.1 + 600;
        const servicezone_width = g.children[i].geta(pole_burial_depth);
        g.children[i].position.z = sidewalk_width + servicezone_width / 2;
        let servicezone = TH3D.createBox(0, x, 0, sidewalk_width + servicezone_width / 2, 0x0000ff, sidewalk_height, servicezone_width, sidewalk_length)

        let curb = TH3D.createBox(0, x, 0, sidewalk_width + servicezone_width + sidewalk_height / 2, 0x000000, sidewalk_height, sidewalk_height, sidewalk_length)
        
        let wall = TH3D.createBox(0, x, wall_height/2, -sidewalk_height/2, 0x808080, wall_height, sidewalk_height, sidewalk_length)
        g.d1= servicezone_width;
        g.add(sidewalk);
        g.add(servicezone);
        g.add(curb);
        g.add(wall); 
        this.add(g);

        clickableObjects.push(pole);
        pole.children[0].getinfo = function () {
            return `Poste: ${this.parent.description}`
        }

        clickableObjects.push(sidewalk);
        sidewalk.getinfo = function () {
            return `Sidewalk freezone width: ${(sidewalk_width / 1000).toFixed(1)} m\n
Sidewalk total width: ${((sidewalk_width + servicezone_width+sidewalk_height ) / 1000).toFixed(1)} m\n
`
        }

        clickableObjects.push(servicezone);
        servicezone.getinfo = function () {
            return `Service zone width: ${(servicezone_width/10).toFixed(0)} cm`
        }

        clickableObjects.push(curb);
        curb.getinfo = function () {
            return `Curb width: ${(sidewalk_height/10).toFixed(0)} cm`
        }
        
        
    }
    poles.addPole(new TH3D.P17_1000())
    poles.addPole(new TH3D.P17_1500({x: 3000}))
    poles.addPole(new TH3D.P17_2400({x: 6000}))
    poles.addPole(new TH3D.P20_1000({x: 9000}))
    poles.addPole(new TH3D.P20_1500({x: 12000}))
    poles.addPole(new TH3D.P20_2400({x: 15000}))
    poles.addPole(new TH3D.P23_1500({x: 18000}))
    poles.addPole(new TH3D.P23_2400({x: 21000}))


   

    scene.add(poles);
   
    





    ////////



    ////////////////////////

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

        









    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity
    scene.add(ambientLight);
    
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




