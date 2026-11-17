import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from 'jsm/environments/RoomEnvironment.js';

// 1. MAIN SCENE AND CAMERA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080818);

const camera = new THREE.PerspectiveCamera(
60, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 2, 50);
camera.lookAt(0, 1.5, -100);

// 2. RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls  = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.003;

function createBox(x, y, z, width, height, depth, color) {

    const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
    );

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.7,
        roughness: 0.4
    });

    const box = new THREE.Mesh(geometry, material);

    box.position.set(x, y, z);

    box.castShadow = true;
    box.receiveShadow = true;

    return box;
}

function createRoundedBox(x, y, z, width, height, depth, color) {
    const geometry = new RoundedBoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );

    cube.position.set(x, y, z);

    cube.castShadow = true;
    cube.receiveShadow = true;

    return cube;
}

function createTower(x, z, height, width, color) {

    const geometry = new THREE.BoxGeometry(
        width,
        height,
        width
    );

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.3
    });

    const tower = new THREE.Mesh(geometry, material);

    tower.position.set(x, height / 2, z);

    tower.castShadow = true;

    return tower;
}

function createCylinder(posX, posY, posZ, rTop, rBottom, height, color) {

    const geometry = new THREE.CylinderGeometry(
        rTop, 
        rBottom, 
        height
    );

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.3
    });

    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.set(posX, posY, posZ);

    cylinder.castShadow = true;

    return cylinder;
}

function createSphere(posX, posY, posZ, radius, color) {

    const geometry = new THREE.SphereGeometry(radius);

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5
    });

    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(posX, posY, posZ);

    sphere.castShadow = true;

    return sphere;
}

const trees = [];

function createTree(posX, posZ, rTop, rBottom, height, spheres) {

    const tree = new THREE.Group();

    const trunk = createCylinder(0, 0 , 0, rTop, rBottom, height, 0x572d25);

    tree.add(trunk);

    const mainSphere = createSphere(0, height/2.5 + rTop, 0, rTop * 2, 0x28571D);

    tree.add(mainSphere);

    for (let i = 0; i < spheres; i++) {

        const x = THREE.MathUtils.randFloat(-rTop*1.7, rTop*1.7);
        const z = THREE.MathUtils.randFloat(-rTop*1.7, rTop*1.7);
        const y = THREE.MathUtils.randFloat(height/20, height/1.5);

        const radius = THREE.MathUtils.randFloat(rTop, rTop*3);

        const sphere = createSphere(0, 0, 0, radius, 0x28571D);

        tree.add(sphere);

        sphere.position.set(x, y, z)
    }

    tree.position.set(posX, height/2, posZ);
    
    trees.push(tree);

    return tree;
}

function createTrees(totalTrees) {
    let x = 0;
    let z = 50;
    
    for (let i = 0; i < totalTrees; i++) {
        const errX = THREE.MathUtils.randFloat(-0.8, 0.8);
        const errZ = THREE.MathUtils.randFloat(-1, 1);
        // const x = THREE.MathUtils.randFloat(-20, 20);
        // const z = THREE.MathUtils.randFloat(-40, 40);
        if (i % 2 === 0) {
            x = 5.2;
            z -= THREE.MathUtils.randFloat(8, 10);;
        } else {
            x = -5.2;
        }

        x += errX;
        z += errZ;

        const rTop = THREE.MathUtils.randFloat(0.5, 1.2);
        const rBottom = THREE.MathUtils.randFloat(rTop*1.3, rTop*1.7);

        const height = THREE.MathUtils.randFloat(7, 12);

        const spheres = THREE.MathUtils.randFloat(height, height*2);

        scene.add(createTree(x, z, rTop, rBottom, height, spheres));
    }
}

function createSofa(posX, posY, posZ, seats, seatSize) {
    const sofa = new THREE.Group();
    const height = seatSize*0.7;
    const totalWidth = seats * seatSize;
    let x = -(totalWidth/2 - 0.5*seatSize);

    for (let i = 0; i < seats; i++) {
        
        const seat = createRoundedBox(x, height/2, 0, seatSize, height, seatSize/1.2, 0x612E4F);

        sofa.add(seat);

        const back = createRoundedBox(x, height, -seatSize/2, seatSize, height*2, seatSize/3, 0x572946);
        
        sofa.add(back);

        x += seatSize;  
    }

    sofa.position.set(0, 0, 0);

    x = totalWidth/2;
    const leftSide = createRoundedBox(x, height*1.3/2, 0, seatSize/3, height*1.3, seatSize, 0x572946);
    const rightSide = createRoundedBox(-x, height*1.3/2, 0, seatSize/3, height*1.3, seatSize, 0x572946);

    sofa.add(leftSide);
    sofa.add(rightSide);

    sofa.position.set(posX, posY, posZ);

    return sofa;
}

//scene.add(createSofa(15, 0, 7, 2, 3));

// 3. MAIN SCENE LIGHTING
// scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// const mainLight = new THREE.DirectionalLight(0xffffff, 2);
// mainLight.position.set(0, 20, 0);
// scene.add(mainLight);

// const groundGeometry = new THREE.BoxGeometry(
//     30, 0.5, 100
// );

// const groundMaterial = new THREE.MeshStandardMaterial({
//     color: 0x102f30,
//     metalness: 0.7,
//     roughness: 0.5
// });

// const ground = new THREE.Mesh(
//     groundGeometry,
//     groundMaterial
// );

// ground.position.y = -0.25;

// ground.receiveShadow = true;

// scene.add(ground);

const platforms = [];

function createSteps(totalSteps){
    let z = 45;

    for (let i = 0; i < totalSteps; i++) {
        let x = 1;
        let err = THREE.MathUtils.randFloat(-0.5, 0.5);

        let width = 2.4, depth = 2.4;

        if (i % 2 == 0) {
            x = 1.3;
        } else {
            x = -1.3;
        }

        x += err;

        width += err/2;
        depth += err/2;

        const step = createBox(x, 0.025, z, width, 0.05, depth, 0x757655);

        platforms.push(step);

        scene.add(step);

        z += err/2;

        z -= 3.8;
    }
}

function createPlatform() {

    const platform = new THREE.Group();
    const base = createCylinder(0, 0, 0, 6, 6, 1);

    platform.add(base);

    return platform;

}

function makeFenceXAxis(startX, y, startZ, radius, height, totalBars) {
    const fence = new THREE.Group();
    const fenceBarArray = [];

    let x = startX;
    let z = startZ;

    for (let i = 0; i < totalBars-1; i++) {
        const bar = createCylinder(x, y, z, radius, radius, height, 0x5C3F3F);

        fence.add(bar);
        fenceBarArray.push(bar);

        const horizontalHeight = height;

        const horizontalBar1 = createCylinder(x + horizontalHeight/2.2, y + horizontalHeight/(horizontalHeight+1), z, radius/2, radius/2, horizontalHeight, 0x5C3F3F).rotateZ(1);
        const horizontalBar2 = createCylinder(x + horizontalHeight/2.2, y - horizontalHeight/(horizontalHeight+1), z, radius/2, radius/2, horizontalHeight, 0x5C3F3F).rotateZ(1);

        fence.add(horizontalBar1);
        fence.add(horizontalBar2);

        x += horizontalHeight/1.1;
    }

    const bar = createCylinder(x, y, z, radius, radius, height, 0x5C3F3F);

    fence.add(bar);
    fenceBarArray.push(bar);

    return fence;

}

function makeFenceZAxis(startX, y, startZ, radius, height, totalBars) {
    const fence = new THREE.Group();
    const fenceBarArray = [];

    let x = startX;
    let z = startZ;

    for (let i = 0; i < totalBars-1; i++) {
        const bar = createCylinder(x, y, z, radius, radius, height, 0x5C3F3F);

        fence.add(bar);
        fenceBarArray.push(bar);

        const horizontalHeight = height;

        const horizontalBar1 = createCylinder(x, y + horizontalHeight/(horizontalHeight+1), z + horizontalHeight/2.2, radius/2, radius/2, horizontalHeight, 0x5C3F3F).rotateX(1);
        const horizontalBar2 = createCylinder(x, y - horizontalHeight/(horizontalHeight+1), z + horizontalHeight/2.2, radius/2, radius/2, horizontalHeight, 0x5C3F3F).rotateX(1);

        fence.add(horizontalBar1);
        fence.add(horizontalBar2);

        z += horizontalHeight/1.1;
    }

    const bar = createCylinder(x, y, z, radius, radius, height, 0x5C3F3F);

    fence.add(bar);
    fenceBarArray.push(bar);

    return fence;

}

const environment = new RoomEnvironment();
const pmremGenerator = new THREE.PMREMGenerator( renderer );
const envMap = pmremGenerator.fromScene( environment ).texture;
scene.environment = envMap;


// 11. ANIMATION AND RENDER ORDER
const clock = new THREE.Clock();

function animate() {
requestAnimationFrame(animate);

const elapsed = clock.getElapsedTime();

// portalMaterial.uniforms.uTime.value = elapsed;

controls.update();

// Render the portal scene to its texture first.
// renderer.setRenderTarget(portalTexture);
renderer.clear();
// renderer.render(portalScene, portalCamera);

// Then render the main scene to the browser.
renderer.setRenderTarget(null);
renderer.render(scene, camera);
}
animate();

// 12. RESIZE THE MAIN CAMERA AND RENDERER
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});