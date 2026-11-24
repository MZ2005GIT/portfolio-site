import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from "jsm/geometries/RoundedBoxGeometry.js";
import { Timer } from 'jsm/misc/Timer.js';
import { openProjects } from "./ui.js";

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

let videoTexture = createVideoTexture("solarsystem.mp4");

function createVideoTexture(videoPath) {

    const video = document.createElement("video");

    video.src = videoPath;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const texture = new THREE.VideoTexture(video);

    video.play();

    return texture;
}

function createTV(posX, posY, posZ, width, height) {

    const tv = new THREE.Group();

    // Screen
    const screen = createRoundedBox(
        0, height / 2, 0,
        width, height, 0.15,
        0x111111
    );

    tv.add(screen);

    // Stand
    const stand = createBox(
        0, 0.15, 0.1,
        width * 1.1, 0.3, 0.7,
        0x30251D
    );

    tv.add(stand);

    // Legs
    const leftLeg = createBox(
        -width * 0.3, 0.05, 0.1,
        0.15, 0.2, 0.4,
        0x222222
    );

    const rightLeg = createBox(
        width * 0.3, 0.05, 0.1,
        0.15, 0.2, 0.4,
        0x222222
    );

    tv.add(leftLeg);
    tv.add(rightLeg);

    tv.position.set(posX, posY, posZ);

    tv.userData.screen = screen;

    screen.material.map = videoTexture;
    screen.material.color.set(0xffffff);
    screen.material.needsUpdate = true;

    tv.userData.videoTexture = videoTexture;

    return tv;
}

function createDresser(posX, posY, posZ, width, height, numDrawers) {

    const dresser = new THREE.Group();

    const totalWidth = width;
    const drawerHeight = height / numDrawers;

    // Main body
    const body = createBox(
        0, height / 2, 0,
        totalWidth, height, 1.2,
        0x70452D
    );

    dresser.add(body);

    // Top surface
    const top = createBox(
        0, height + 0.1, 0,
        totalWidth + 0.2, 0.2, 1.3,
        0x4A2D20
    );

    dresser.add(top);

    // Drawers
    for (let i = 0; i < numDrawers; i++) {

        const drawerY = height - drawerHeight / 2 - i * drawerHeight;

        const drawer = createBox(
            0, drawerY, 0.62,
            width * 0.85, drawerHeight * 0.8, 0.08,
            0x95613F
        );

        dresser.add(drawer);

        // Handle
        const handle = createBox(
            0, drawerY, 0.7,
            width * 0.15, 0.08, 0.08,
            0xD4AF37
        );

        dresser.add(handle);
    }

    dresser.position.set(posX, posY, posZ);

    return dresser;
}

function createDoor(posX, posY, posZ, width, height) {

    const door = new THREE.Group();
    const pivot = new THREE.Object3D();

    // Door panel
    const panel = createBox(
        0, height / 2, 0,
        width, height, 0.4,
        0x70452D
    );
    
    pivot.add(panel);
    pivot.position.x = width/2;

    door.add(pivot);
    panel.position.x = -width/2;

    // Left frame
    const leftFrame = createBox(
        -width / 2 - 0.1, height / 2, 0,
        0.2, height + 0.2, 0.5,
        0x3B2419
    );

    door.add(leftFrame);

    // Right frame
    const rightFrame = createBox(
        width / 2 + 0.1, height / 2, 0,
        0.2, height + 0.2, 0.5,
        0x3B2419
    );

    door.add(rightFrame);

    // Top frame
    const topFrame = createBox(
        0, height, 0,
        width + 0.4, 0.2, 0.5,
        0x3B2419
    );

    door.add(topFrame);

    // Handle
    const handle1 = createSphere(
        -width/2 + 0.15, 0, 0.3,
        0.1,
        0xD4AF37
    );

    const handle2 = createSphere(
        -width/2 + 0.15, 0, -0.3,
        0.1,
        0xD4AF37
    );

    panel.add(handle1);
    panel.add(handle2);

    pivot.rotateY(-Math.PI/2);

    door.position.set(posX, posY, posZ);

    return door;
}

function createCoffeeTable(posX, posY, posZ, width, height, depth) {

    const table = new THREE.Group();

    // Tabletop
    const top = createBox(
        0, height, 0,
        width, 0.2, depth,
        0x70452D
    );

    table.add(top);

    // Leg positions
    const legX = width / 2 - 0.15;
    const legZ = depth / 2 - 0.15;

    // Front left leg
    const leg1 = createCylinder(
        -legX, height / 2, legZ,
        0.1, 0.1, height,
        0x30251D
    );

    table.add(leg1);

    // Front right leg
    const leg2 = createCylinder(
        legX, height / 2, legZ,
        0.1, 0.1, height,
        0x30251D
    );

    table.add(leg2);

    // Back left leg
    const leg3 = createCylinder(
        -legX, height / 2, -legZ,
        0.1, 0.1, height,
        0x30251D
    );

    table.add(leg3);

    // Back right leg
    const leg4 = createCylinder(
        legX, height / 2, -legZ,
        0.1, 0.1, height,
        0x30251D
    );

    table.add(leg4);

    table.position.set(posX, posY, posZ);

    return table;
}

function createLamp(posX, posY, posZ, height, lightColor) {

    const lamp = new THREE.Group();

    // Base
    const base = createCylinder(
        0, 0.1, 0,
        height * 0.12, height * 0.12,
        0.2,
        0x333333
    );

    lamp.add(base);

    // Vertical stand
    const stand = createCylinder(
        0, height * 0.5, 0,
        height * 0.025, height * 0.025,
        height * 0.8,
        0x555555
    );

    lamp.add(stand);

    // Lampshade
    const shade = new THREE.Mesh(
        new THREE.ConeGeometry(
            height * 0.15,
            height * 0.2,
            16,
            1,
            true
        ),
        new THREE.MeshStandardMaterial({
            color: 0xE8C878,
            side: THREE.DoubleSide,
            roughness: 0.7
        })
    );

    shade.position.set(0, height * 0.9, 0);
    //shade.rotation.x = Math.PI;
    shade.castShadow = true;

    lamp.add(shade);

    // Light bulb
    const bulb = createSphere(
        0, height * 0.85, 0,
        height * 0.045,
        0xFFF0B0
    );

    lamp.add(bulb);

    // Actual light source
    const light = new THREE.PointLight(
        lightColor,
        10,
        height * 4
    );

    light.position.set(0, height * 0.8, 0);

    lamp.add(light);

    lamp.position.set(posX, posY, posZ);

    return lamp;
}

async function createRoom(posX, posY, posZ, width, depth, wallColor, floorColor, lampColor) {

    const room = new THREE.Group();

    const height = 5;
    const wallThickness = 0.3;

    // Random furniture values
    const sofaSeats = THREE.MathUtils.randInt(2, 4);
    const dresserDrawers = THREE.MathUtils.randInt(2, 5);

    const sofaSize = 1.2;
    const sofaWidth = sofaSeats * sofaSize;

    const doorWidth = 2;
    const doorHeight = 3.5;

    // FLOOR
    const floor = createBox(
        0, 0, 0,
        width, 0.2, depth,
        floorColor
    );

    room.add(floor);

    // BACK WALL
    const backWall = createBox(
        0, height / 2, -depth / 2,
        width, height, wallThickness,
        wallColor
    );

    room.add(backWall);

    // LEFT WALL
    const leftWall = createBox(
        -width / 2, height / 2, 0,
        wallThickness, height, depth,
        wallColor
    );

    room.add(leftWall);

    // RIGHT WALL
    const rightWall = createBox(
        width / 2, height / 2, 0,
        wallThickness, height, depth,
        wallColor
    );

    room.add(rightWall);

    // FRONT WALL LEFT
    const frontLeft = createBox(
        -(width / 2 - (width - doorWidth) / 4),
        height / 2, depth / 2,
        (width - doorWidth) / 2,
        height, wallThickness,
        wallColor
    );

    room.add(frontLeft);

    // FRONT WALL RIGHT
    const frontRight = createBox(
        (width / 2 - (width - doorWidth) / 4),
        height / 2, depth / 2,
        (width - doorWidth) / 2,
        height, wallThickness,
        wallColor
    );

    room.add(frontRight);

    // FRONT WALL TOP
    const frontTop = createBox(
        0, (height + doorHeight) / 2, depth / 2,
        doorWidth, height - doorHeight,
        wallThickness,
        wallColor
    );

    room.add(frontTop);

    // const frontWall = createBox(
    //     0, height / 2, depth / 2,
    //     width, height, wallThickness,
    //     wallColor
    // );

    // room.add(frontWall);

    // SOFA - RIGHT WALL (+X)
    const sofa = createSofa(
        width / 2 - 1.5,
        0.1,
        0,
        sofaSeats,
        sofaSize
    );

    room.add(sofa);
    sofa.rotateY(-Math.PI / 2);

    // TV - LEFT WALL (-X)
    const tv = createTV(
        -width / 2 + 0.5,
        height/4,
        0,
        width * 0.4,
        width * 0.3
    );

    room.add(tv);
    tv.rotateY(Math.PI / 2);
    room.userData.tv = tv;

    // COFFEE TABLE
    const table = createCoffeeTable(
        0, 0.1, 0,
        width * 0.3, 0.8, depth * 0.2
    );

    room.add(table);
    table.rotateY(-Math.PI/2);

    // DRESSER - BACK WALL (-Z)
    const dresserWidth = THREE.MathUtils.randFloat(1.2, 1.8);
    const dresserHeight = THREE.MathUtils.randFloat(dresserDrawers * 0.3, dresserDrawers * 0.5);

    const dresser = createDresser(
        0,
        0.1,
        -depth / 2 + 0.8,
        dresserWidth,
        dresserHeight,
        dresserDrawers
    );

    room.add(dresser);

    // DOOR
    const door = createDoor(
        0, 0, depth / 2,
        doorWidth, doorHeight
    );

    room.add(door);

    door.rotateY(Math.PI);

    // LAMP
    const lamp = createLamp(
        -width / 2 + 0.8,
        0.1,
        -depth / 2 + 2,
        THREE.MathUtils.randFloat(3, 4), lampColor
    );

    room.add(lamp);

    const whiteboard = await initializeWhiteboard(0, height / 2 + 0.5, -depth / 2 + 0.5, 5, 2.5);

    room.add(whiteboard);

    room.position.set(posX, posY, posZ);

    scene.add(room);

    return room;
}

const room = await createRoom(
    0, 0, -55,
    10, 10,
    0xD8D2C8,
    0xA68A64,
    0xFFE2A0
);

function changeVideo(videoPath){
    videoTexture = createVideoTexture(videoPath);

    const tv = room.userData.tv;
    const screen = tv.userData.screen;

    screen.material.map = videoTexture;
    screen.material.color.set(0xffffff);
    screen.material.needsUpdate = true;

    tv.userData.videoTexture = videoTexture;
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

let mixer;
const timer = new Timer();
let model;

new GLTFLoader().load(
  'alien.glb',
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    
    const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
    console.log(size, model.position);
    model.scale.set(0.8, 0.8, 0.8);
    model.position.z = -51.4;
    model.position.x = -3.7;
    model.position.y = 0.1;

    //model.position.z = 40;
    //model.rotation.y = -Math.PI/2;

    // Animations come as an array of AnimationClips
    mixer = new THREE.AnimationMixer(model);
    console.log(gltf.animations.map(a => a.name)); // see what's available

    const clip = gltf.animations[0];
    mixer.clipAction(clip).play();
  },
  (xhr) => console.log((xhr.loaded / xhr.total * 100).toFixed(0) + '% loaded'),
  (err) => console.error('Load failed', err)
);

renderer.setAnimationLoop((timestamp) => {
  timer.update(timestamp);
  if (mixer) mixer.update(timer.getDelta());
  if (model) {

  } 
  renderer.render(scene, camera);
});


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
scene.add(makeFenceXAxis(-13.5, 2, -48, 0.2, 4, 4));
scene.add(makeFenceXAxis(3, 2, -48, 0.2, 4, 4));


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

async function makeWhiteboardTexture(heading, text) {

    const paper = document.createElement('div');

    paper.className = 'whiteboard';

    const title = document.createElement('h1');
    title.textContent = heading;

    const details = document.createElement('p');
    details.textContent = text;

    paper.appendChild(title);
    paper.appendChild(details);

    document.body.appendChild(paper);

    const canvas = await html2canvas(paper);

    const texture = new THREE.CanvasTexture(canvas);

    paper.remove();

    return texture;
}

function createWhiteboard(posX, posY, posZ, width, height, texture) {

    const whiteboard = new THREE.Group();

    const thickness = 0.2;

    // Main whiteboard surface
    const board = createBox(
        0, 0, 0,
        width, height, thickness,
        0xFFFFFF
    );

    // Apply the text texture to the front face
    board.material[4] = new THREE.MeshStandardMaterial({
        map: texture
    });

    whiteboard.add(board);

    // Frame
    const frameWidth = 0.15;
    const frameThickness = 0.4;
    const frameColor = 0x777777;

    const topFrame = createBox(
        0, height / 2, 0,
        width + frameWidth,
     frameWidth,
        frameThickness,
        frameColor
    );

    const bottomFrame = createBox(
        0, -height / 2, 0,
        width + frameWidth,
     frameWidth,
        frameThickness,
        frameColor
    );

    const leftFrame = createBox(
        -width / 2, 0, 0,
     frameWidth,
        height,
        frameThickness,
        frameColor
    );

    const rightFrame = createBox(
        width / 2, 0, 0,
     frameWidth,
        height,
        frameThickness,
        frameColor
    );

    whiteboard.add(topFrame);
    whiteboard.add(bottomFrame);
    whiteboard.add(leftFrame);
    whiteboard.add(rightFrame);

    // Position
    whiteboard.position.set(posX, posY, posZ);

    // Store references for updating later
    whiteboard.userData.board = board;
    whiteboard.userData.width = width;
    whiteboard.userData.height = height;

    scene.add(whiteboard);

    return whiteboard;
}

async function updateWhiteboard(whiteboard, heading, text) {

    const texture = await makeWhiteboardTexture(heading, text);

    const board = whiteboard.userData.board;

    board.material[4].map = texture;
    board.material[4].needsUpdate = true;
}

async function initializeWhiteboard(posX, posY, posZ, width, height) {

    const texture = await makeWhiteboardTexture(
        'Hello',
            'Click on the plushie to select a project'
    );

    const whiteboard = createWhiteboard(
        posX, posY, posZ,
        width, height,
        texture
    );

    return whiteboard;
}

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
    const speed = 10;

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

    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -65, 45);
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


const mouse = new THREE.Vector2();

const raycaster = new THREE.Raycaster();

renderer.domElement.addEventListener("click", function(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    let mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouse.x = mouseX;
    mouse.y = mouseY;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(model);

    if (intersects.length > 0) {
        openProjects();
    }

})

let currentProject = null;

window.addEventListener("project-selected", (event) => {

    currentProject = event.detail;

    console.log("Selected project:", currentProject);

    if(event.detail === "seeds") {
        changeVideo("seeds.mp4");
    }

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