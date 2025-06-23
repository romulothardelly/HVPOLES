import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export class Axis { 
    constructor(size=1000) {
        this.lines = []
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const points = [];
       
       /// x is blue
       // points.push(new THREE.Vector3(- size, 0, 0));
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(size, 0, 0));
               
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.lines.push(new THREE.Line(geometry, material))

        // y is green
        const material2 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const points2 = [];

        
        //points2.push(new THREE.Vector3(0, -size, 0));
        points2.push(new THREE.Vector3(0, 0, 0));
        points2.push(new THREE.Vector3(0, size, 0));
               
        const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        this.lines.push(new THREE.Line(geometry2, material2))

        // z is red
        const material3 = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const points3 = [];
        //points3.push(new THREE.Vector3(0, 0, -size));
        points3.push(new THREE.Vector3(0, 0, 0));
        points3.push(new THREE.Vector3(0, 0, size));
               
        const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
        this.lines.push(new THREE.Line(geometry3, material3))        

    }
    

}


export function createPlane(w, d) {

        const geometry = new THREE.PlaneGeometry(50000, 50000);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });

        
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2;
        plane.castShadow = false; //default is false
        plane.receiveShadow = true; //default
        plane.name = "Plane";
        return plane;
    }

export function createCube(x, y, z,color,h,w,d,wired=false) {

        const geometry = new THREE.BoxGeometry(d,h, w);
        const material = new THREE.MeshStandardMaterial({
        color: color ,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 0.5
        });
        
        y = y + h / 2; // center the cube on the y axis

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.castShadow = true; //default is false
       cube.receiveShadow = true; //default
       
      if (wired) {
            const edges = new THREE.EdgesGeometry(geometry); // create geometry with edges
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const edgeLines = new THREE.LineSegments(edges, lineMaterial);

            // Make sure the edges follow the mesh's position and rotation
            cube.add(edgeLines);
        }
    
        
        return cube;

    
        
}
    


export function createCubeTexture(x, y, z,color,h,w,d,wired=false) {

    const geometry = new THREE.BoxGeometry(d, h, w);

    const loader = new THREE.TextureLoader();

// 2. Load 6 images (one for each face)
    const material = [
    new THREE.MeshBasicMaterial({ map: loader.load('A.png') }), // right
    new THREE.MeshBasicMaterial({ map: loader.load('B.png') }), // left
    new THREE.MeshBasicMaterial({ map: loader.load('C.png') }), // top
    new THREE.MeshBasicMaterial({ map: loader.load('D.png') }), // bottom
    new THREE.MeshBasicMaterial({ map: loader.load('E.png') }), // front
    new THREE.MeshBasicMaterial({ map: loader.load('F.png') }), // back
    ];
    



    
       /* const material = new THREE.MeshStandardMaterial({
        color: color ,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 0.5
        });*/
        
        y = y + h / 2; // center the cube on the y axis

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.castShadow = true; //default is false
       cube.receiveShadow = true; //default
       
      if (wired) {
            const edges = new THREE.EdgesGeometry(geometry); // create geometry with edges
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const edgeLines = new THREE.LineSegments(edges, lineMaterial);

            // Make sure the edges follow the mesh's position and rotation
            cube.add(edgeLines);
        }
    
        
        return cube;

    }