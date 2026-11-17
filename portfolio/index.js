import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from "jsm/geometries/RoundedBoxGeometry.js";

// 1. MAIN SCENE AND CAMERA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080818);

const camera = new THREE.PerspectiveCamera(
60, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 2, 50);
camera.lookAt(0, 2, 0);

// 2. RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const controls  = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.003;

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

    const materials = [
        material, material, material,
        material, material, material
    ];

    const box = new THREE.Mesh(geometry, materials);

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
            x = 5.5;
            z -= THREE.MathUtils.randFloat(8, 10);;
        } else {
            x = -5.3;
        }

        x += errX;
        z += errZ;

        const rTop = THREE.MathUtils.randFloat(0.5, 1.2);
        const rBottom = THREE.MathUtils.randFloat(rTop*1.3, rTop*1.7);

        const height = THREE.MathUtils.randFloat(9, 12);

        const spheres = THREE.MathUtils.randFloat(height, height*2);

        scene.add(createTree(x, z, rTop, rBottom, height, spheres));
    }
}

createTrees(20);

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

    scene.add(sofa);

    return sofa;
}


// 3. MAIN SCENE LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const mainLight = new THREE.DirectionalLight(0xffffff, 2);
mainLight.position.set(0, 20, 0);
scene.add(mainLight);

const groundGeometry = new THREE.BoxGeometry(
    30, 0.5, 100
);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x102f30,
    metalness: 0.7,
    roughness: 0.5
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.position.y = -0.25;

ground.receiveShadow = true;

scene.add(ground);

const platforms = [];

function createSteps(totalSteps){
    let z = 45;

    for (let i = 0; i < totalSteps; i++) {
        let x = 1;
        let err = THREE.MathUtils.randFloat(-0.5, 0.5);

        let width = 2.4, depth = 2.4;

        if (i % 2 == 0) {
            x = 1.4;
        } else {
            x = -1.4;
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

createSteps(25);

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

scene.add(makeFenceXAxis(-13, 2, 48, 0.2, 4, 8));
scene.add(makeFenceXAxis(-13, 2, -48, 0.2, 4, 8));


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

scene.add(makeFenceZAxis(14, 2, -48, 0.2, 4, 27));
scene.add(makeFenceZAxis(-14, 2, -48, 0.2, 4, 27));


{
// 5. PORTAL FRAME
// const frameMaterial = new THREE.MeshStandardMaterial({
// color: 0x00ccff,
// emissive: 0x0077ff,
// emissiveIntensity: 2,
// metalness: 0.6,
// roughness: 0.25
// });

// function createFramePart(width, height, x, y, z) {
// const part = new THREE.Mesh(
// new THREE.BoxGeometry(width, height, 0.25),
// frameMaterial
// );
// part.position.set(x, y, z);
// scene.add(part);
// return part;
// }

// createFramePart(0.15, 3.4, -1.4, 1.8, 0);
// createFramePart(0.15, 3.4, 1.4, 1.8, 0);
// createFramePart(2.9, 0.15, 0, 3.5, 0);
// createFramePart(2.9, 0.15, 0, 0.1, 0);

// 6. SECOND SCENE: THE WORLD INSIDE THE PORTAL
// const portalScene = new THREE.Scene();

// portalScene.background = scene.background.clone();

// const enemy = createEnemy();

// portalScene.add(enemy);

// enemy.position.y = 1;

// enemy.position.z = 6;

// portalScene.add(createPlatform(0, 0, 6, 3, 0.5, 3));

// portalScene.add(createTower(3, 0, 5, 2));

// portalScene.add(createTower(-3, 0, 5, 2));

// const portalCamera = new THREE.PerspectiveCamera(
//     60,
//     2.65 / 3.1,
//     0.1,
//     100
// );

// portalCamera.position.copy(camera.position);
// portalCamera.quaternion.copy(camera.quaternion);
// portalCamera.rotateX = 1.5;

// portalScene.add(new THREE.AmbientLight(0xffffff, 1.5));

// // 7. OBJECTS INSIDE THE PORTAL

// // 8. OFF-SCREEN TEXTURE FOR THE PORTAL VIEW
// // Its aspect ratio matches the portal plane.
// const portalTexture = new THREE.WebGLRenderTarget(800, 936, {
// minFilter: THREE.LinearFilter,
// magFilter: THREE.LinearFilter,
// format: THREE.RGBAFormat,
// depthBuffer: true
// });

// // 9. SHADER: SHOW THE TEXTURE, ADD MOVING COLOUR AND FADE EDGES
// const portalMaterial = new THREE.ShaderMaterial({
// uniforms: {
// tPortal: { value: portalTexture.texture },
// uTime: { value: 0 }
// },

// vertexShader: `
// varying vec2 vUv;

// void main() {
// vUv = uv;
// gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `,

// fragmentShader: `
// uniform sampler2D tPortal;
// varying vec2 vUv;

// void main() {
// vec4 portalColor = texture2D(tPortal, vUv);

// vec3 glow = vec3(0.05, 0.2, 0.8);
// vec3 finalColor = portalColor.rgb
// + glow * 0.05;

// float edge = min(
// min(vUv.x, 1.0 - vUv.x),
// min(vUv.y, 1.0 - vUv.y)
// );
// float alpha = smoothstep(0.0, 0.1, edge);

// gl_FragColor = vec4(finalColor, alpha);

// #include <tonemapping_fragment>
// #include <colorspace_fragment>
// }
// `,
// transparent: true,
// depthWrite: false,
// side: THREE.DoubleSide
// });

// // 10. PORTAL PLANE
// const portalPlane = new THREE.Mesh(
// new THREE.PlaneGeometry(2.65, 3.1),
// portalMaterial
// );
// portalPlane.position.set(0, 1.8, 0.14);
// scene.add(portalPlane);
}

// Convert canvas to texture
async function makePaper(heading, text) {

    const paper = document.createElement('div');

    paper.className = 'paper';

    const title = document.createElement('h1');
    title.textContent = heading;

    const details = document.createElement('p');
    details.textContent = text;

    paper.appendChild(title);
    paper.appendChild(details);

    document.body.appendChild(paper);

    // Capture the HTML element
    const canvas = await html2canvas(paper);

    // Convert to Three.js texture
    const texture = new THREE.CanvasTexture(canvas);

    // Remove temporary HTML element
    paper.remove();

    return texture;
}

const textures = [];

async function makeTextures() {

    const information = [
        ['About Me', 'Mashal Zehra\n21\nAspiring Game Developer'],
        ['Skills And Technologies', 'JavaScript\nThree.js\nC#\nUnity\nUnreal Engine'],
        ['Education And Experience', 'University Student\n.NET intern at SIEHS\nBlueprints Developer intern at HAS'],
        ['Contact Me', 'Email: zehramashal10@gmail.com']
    ];

    for (let i = 0; i < information.length; i++) {

        const texture = await makePaper(
            information[i][0],
            information[i][1]
        );

        textures.push(texture);
    }
}

const posterBoards = [];

function createPosterBoard(posX, posY, posZ, height, width, texture) {
    const posterBoard = new THREE.Group();
    const thickness = 0.2;

    const boardY = height*1.2;
    const boardZ = 0;

    const leftLeg = createBox(0, 0, 0, thickness, height, thickness, 0x5C3F3F);
    const rightLeg = createBox(0, 0, 0, thickness, height, thickness, 0x5C3F3F);

    leftLeg.rotation.z = Math.PI/5;
    rightLeg.rotation.z = -Math.PI/5;

    leftLeg.position.x = height*0.5;
    rightLeg.position.x = -height*0.5;

    posterBoard.add(leftLeg);
    posterBoard.add(rightLeg);

    const board = createBox(0, boardY, boardZ, width, height*2, thickness/4);
    board.material[4] = new THREE.MeshStandardMaterial({
    map: texture});

    const barThickness = thickness/2;

    // const leftBar = createBox(width/2, 0, boardZ + dp, barThickness, height*2, barThickness);
    // const rightBar = createBox(-width/2, 0, boardZ + dp, barThickness, height*2, barThickness);
    const topBar = createBox(0, height, boardZ, width + barThickness, barThickness, barThickness, 0x5C3F3F);
    const bottomBar = createBox(0, -(height), boardZ, width + barThickness, barThickness, barThickness, 0x5C3F3F);

    //board.add(leftBar);
    //board.add(rightBar);
    board.add(topBar);
    board.add(bottomBar);

    board.rotation.x = -Math.PI/16;

    posterBoard.add(board);    

    posterBoard.position.set(posX, posY, posZ);

    posterBoards.push(posterBoard);

    scene.add(posterBoard);

    posterBoard.userData.board= board;
    posterBoard.userData.height = height*2;
    posterBoard.userData.width = width;

    return posterBoard;
}

function createPosterBoards(number) {

    let x = 3.8;
    let z = 35;
    
    let rot = Math.PI;
    
    for (let i = 0; i < number; i++) {
        const height = THREE.MathUtils.randFloat(1.5, 2);
        const width = THREE.MathUtils.randFloat(height, height + 1.5);
        if (i % 2 === 0) {
            x = -3.5;
            rot = Math.PI/4;
        } else {
            x = 3.5;
            rot = -Math.PI/4;
        }

        const board = createPosterBoard(x, 0.5, z, height, width, textures[i]);

        board.rotation.y = rot;

        z -= 18;
    }
}

async function initializePosters() {

    await makeTextures();

    createPosterBoards(4);
}

initializePosters();

const keys = {};

window.addEventListener(
    "keydown",
    function(event)
    {
        keys[event.key.toLowerCase()] = true;
    }
);

window.addEventListener(
    "keyup",
    function(event)
    {
        keys[event.key.toLowerCase()] = false;
    }
);

function moveCamera(deltaTime)
{
    const speed = 5;

    if (keys["w"])
    {
        camera.position.z -= speed * deltaTime;
    }

    if (keys["s"])
    {
        camera.position.z += speed * deltaTime;
    }

    if (keys["a"])
    {
        camera.position.x -= speed * deltaTime;
    }

    if (keys["d"])
    {
        camera.position.x += speed * deltaTime;
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -14, 14);

    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -45, 45);
}

let isMouseDown = false;

let previousMouseX = 0;

let rotationSpeed = 0.005;

document.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        isMouseDown = true;

        previousMouseX = event.clientX;
    }
});

document.addEventListener('mousemove', (event) => {

    if (!isMouseDown) return;

    let deltaX = event.clientX - previousMouseX;

    camera.rotation.y -= deltaX * rotationSpeed;

    previousMouseX = event.clientX;

});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

let previousTime;

function animate(currentTime) {
    requestAnimationFrame(animate);

    if (previousTime === undefined)
    {
        previousTime = currentTime;
    }

    const deltaTime = (currentTime - previousTime) / 1000;

    previousTime = currentTime;

    // portalMaterial.uniforms.uTime.value = elapsed;

    //controls.update();
    moveCamera(deltaTime);

    // Render the portal scene to its texture first.
    // renderer.setRenderTarget(portalTexture);
    renderer.clear();
    // renderer.render(portalScene, portalCamera);

    // Then render the main scene to the browser.
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
}
animate(performance.now());

// 12. RESIZE THE MAIN CAMERA AND RENDERER
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});