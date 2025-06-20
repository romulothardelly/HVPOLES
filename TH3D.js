import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';








export class Terreno extends THREE.Mesh{
    constructor(code, name, textureimage, x = 1, y = 1, z = 1, xpos = 0, ypos = 0, zpos = 0, radx = 0, rady = 0, radz = 0) {
        const texture = new THREE.TextureLoader().load(textureimage);
        const geometry = new THREE.BoxGeometry( x, y, z );
        const material = new THREE.MeshStandardMaterial({ map: texture });
        super(geometry, material)
        this.name = name
        this.code = code
        this.position.x = xpos
        this.position.y = ypos
        this.position.z = zpos
        this.rotation.x = radx
        this.rotation.y = rady
        this.rotation.z = radz

        
    
    }


}



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
















export class Component extends THREE.Object3D {
    constructor(p) {

        if(!p ) {
            throw new Error("Invalid or missing required parameter");
        }
        if (typeof p.code !== 'string' || p.code.trim() === '') {
            throw new Error("Invalid or missing 'code' parameter");
        }
        if ( typeof p.description !== 'string' || p.description.trim() === '') {
            throw new Error("Invalid or missing 'description' parameter");
        }
        
        if (typeof p.meshtype !== 'string' || p.meshtype.trim() === '') {
            throw new Error("Invalid or missing 'mesh type' parameter");
        } else { 
            if (p.meshtype !== "loaded" && p.meshtype !== "created") {
                throw new Error("Invalid or missing 'mesh type' parameter");
            } else if (p.meshtype === "loaded") { 
                if ( typeof p.path !== 'string' || p.path.trim() === '') {
                    throw new Error("Invalid or missing 'path' parameter");
                }
            }
        }
        super()
     
        this.code = p.code
        this.description = p.description
        this.path = p.path
        this.meshtype = p.meshtype
        this.standard = p.standard ?? ""
        this.version = p.version ?? ""
        this.supplier = p.supplier ?? ""
        this.date = p.date ?? ""
        this.serialnumber = p.serialnumber ?? ""
        this.application = p.application ?? ""
        this.price = p.price ?? ""
        this.color = p.color ?? 0x6f7a80
        
        this.position.x = (typeof p.x === 'number') ? p.x : 0;
        this.position.y = (typeof p.y === 'number') ? p.y : 0;
        this.position.z = (typeof p.z === 'number') ? p.z : 0;
        this.rotation.x = (typeof p.radx === 'number') ? p.radx : 0;
        this.rotation.y = (typeof p.rady === 'number') ? p.rady : 0;
        this.rotation.z = (typeof p.radz === 'number') ? p.radz : 0;
        if (this.meshtype === "loaded") {
            const loader = new GLTFLoader();
            loader.load(this.path, (gltf) => {
                gltf.scene.scale.set(1000, 1000, 1000);
                // Traverse and update material color
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        // Optional: clone material if shared
                        child.material = child.material.clone();
                        child.material.color.set(p.color ?? this.color);  // Default if no color passed
                    }
                });
                this.add(gltf.scene);
            });
        }
        
                
       
    }
}   




export class PoleDT extends Component{
    constructor(p={}) {

        if (!p ) {
            throw new Error("Missing or invalid required parameter")
        }

        let a_base = 0
        let b_base = 0
        let a_top = 0
        let b_top = 0
        let h = 0
        let dan = 0


        if (typeof p.a_base === 'number') {
            a_base = p.a_base          
        } else {
            throw new Error("Invalid or missing 'a_base' parameter");
        }
       
        
        if (typeof p.b_base === 'number') {
            b_base = p.b_base
        } else {
            throw new Error("Invalid or missing 'b_base' parameter");
        }

        if (typeof p.a_top === 'number') {
            a_top = p.a_top
        } else {
            throw new Error("Invalid or missing 'a_top' parameter");
        }
        if (typeof p.b_top === 'number') {
            b_top = p.b_top
        } else {
            throw new Error("Invalid or missing 'b_top' parameter");
        }

        if (typeof p.height === 'number') {
            h = p.height
            
        } else {
            throw new Error("Invalid or missing 'a_base' parameter");
        }
        
        if (typeof p.dan === 'number') {
            dan = p.dan          
        } else {
            throw new Error("Invalid or missing 'dan' parameter");
        }
       

        

        const color = p.color ?? 0x6f7a80
        p.meshtype = "created"
        super(p);
        this.height = h
        this.dan = dan
        this.a_base = a_base
        this.b_base = b_base
        this.a_top = a_top
        this.b_top = b_top
        this.rady = (typeof p.rady === 'number') ? p.rady : Math.PI/2;

        
        
        const vertices = new Float32Array([
            -a_base/2,0,b_base/2,    a_base/2,0,b_base/2,    a_base/2,0,-b_base/2,    -a_base/2,0,-b_base/2,
            -a_top/2,h,b_top/2,    a_top/2,h,b_top/2,    a_top/2,h,-b_top/2,    -a_top/2,h,-b_top/2,
        ]);

        const indices = [
            // --- Side faces ---
            0, 1, 5,  5, 4, 0,   // Front face
            1, 2, 6,  6, 5, 1,   // Right face
            2, 3, 7,  7, 6, 2,   // Back face
            3, 0, 4,  4, 7, 3,   // Left face
        
            // --- Bottom face ---
            0, 2, 1,
            0, 3, 2,
        
            // --- Top face ---
            4, 5, 6,
            4, 6, 7
        ];

         const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        
     
        
        
       
    }

    geta(h) { 

        return this.a_base + (this.a_top - this.a_base) * (h / this.height);
    }
    getb(h) {
        return this.b_base + (this.b_top - this.b_base) * (h / this.height);
    }
}



export class P17_1000 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770713"
            p.description= "Poste 17 metros, 1000 daN, B-1.5"                
            p.height= 17000,
            p.a_base= 658,
            p.b_base= 480,
            p.a_top= 182,
            p.b_top= 140,
            p.dan = 1000
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
    }
}

export class P17_1500 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770723"
            p.description= "Poste 17 metros, 1500 daN, B-3"                
            p.height= 17000,
            p.a_base= 700,
            p.b_base= 510,
            p.a_top= 224,
            p.b_top= 170,
            p.dan = 1500
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
    }
}

export class P17_2400 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770719"
            p.description= "Poste 17 metros, 2400 daN, B-6"                
            p.height= 17000,
            p.a_base= 784,
            p.b_base= 570,
            p.a_top= 308,
            p.b_top= 230,
            p.dan = 2400
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
    }
}

export class P20_1000 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770721"
            p.description= "Poste 20 metros, 1000 daN, B-1.5"                
            p.height= 20000,
            p.a_base= 742,
            p.b_base= 540,
            p.a_top= 182,
            p.b_top= 140,
            p.dan = 1000
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
    }
}

export class P20_1500 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770724"
            p.description= "Poste 20 metros, 1500 daN, B-3"                
            p.height= 20000,
            p.a_base= 784,
            p.b_base= 570,
            p.a_top= 224,
            p.b_top= 170,
            p.dan = 1500
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
    }
}

export class P20_2400 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770730"
            p.description= "Poste 20 metros, 2400 daN, B-6"                
            p.height= 20000,
            p.a_base= 868,
            p.b_base= 630,
            p.a_top= 308,
            p.b_top= 230,
            p.dan = 2400
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
    }
}

export class P23_1500 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770729"
            p.description= "Poste 23 metros, 1500 daN, B-3"                
            p.height= 23000,
            p.a_base= 868,
            p.b_base= 630,
            p.a_top= 224,
            p.b_top= 170,
            p.dan = 1500
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
    }
}

export class P23_2400 extends PoleDT { 
    constructor(p = {}) {
            
            p.code= "6770728"
            p.description= "Poste 23 metros, 2400 daN, B-6"                
            p.height= 23000,
            p.a_base= 952,
            p.b_base= 690,
            p.a_top= 308,
            p.b_top= 230,
            p.dan = 2400
            p.y = -p.height * 0.1 - 600
            p.rady=(typeof p.rady === 'number') ? p.rady : Math.PI/2;
            super(p)
       
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

export function createBox( id,x, y, z,color,h,w,d) {

        const geometry = new THREE.BoxGeometry(d,h , w);
        const material = new THREE.MeshStandardMaterial({
        color: color ,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 0.5
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.castShadow = true; //default is false
        cube.receiveShadow = true; //default
        cube.description = "Cube";
        cube.name = "Cube"+id
        
        return cube;

    }