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
camera.position.set(0, 2, 10);
camera.lookAt(0, 2, 0);

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

    // Door panel
    const panel = createBox(
        0, height / 2, 0,
        width, height, 0.4,
        0x70452D
    );

    door.add(panel);

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
    const handle = createSphere(
        width * 0.3, height / 2, 0.15,
        0.1,
        0xD4AF37
    );

    door.add(handle);

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
        15,
        height * 4
    );

    light.position.set(0, height * 0.8, 0);

    lamp.add(light);

    lamp.position.set(posX, posY, posZ);

    return lamp;
}

function createRoom(posX, posY, posZ, width, depth, wallColor, floorColor, lampColor) {

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
    // const frontLeft = createBox(
    //     -(width / 2 - (width - doorWidth) / 4),
    //     height / 2, depth / 2,
    //     (width - doorWidth) / 2,
    //     height, wallThickness,
    //     wallColor
    // );

    // room.add(frontLeft);

    // // FRONT WALL RIGHT
    // const frontRight = createBox(
    //     (width / 2 - (width - doorWidth) / 4),
    //     height / 2, depth / 2,
    //     (width - doorWidth) / 2,
    //     height, wallThickness,
    //     wallColor
    // );

    // room.add(frontRight);

    // // FRONT WALL TOP
    // const frontTop = createBox(
    //     0, (height + doorHeight) / 2, depth / 2,
    //     doorWidth, height - doorHeight,
    //     wallThickness,
    //     wallColor
    // );

    // room.add(frontTop);

    const frontWall = createBox(
        0, height / 2, depth / 2,
        width, height, wallThickness,
        wallColor
    );

    room.add(frontWall);

    // SOFA
    const sofa = createSofa(
        0, 0.1, -depth / 2 + 2,
        sofaSeats, sofaSize
    );

    room.add(sofa);


    // TV
    const tv = createTV(
        0, 0.1, depth / 2 - 1.5,
        width * 0.3, 1.5
    );

    room.add(tv);


    // COFFEE TABLE
    const table = createCoffeeTable(
        0, 0.1, 0,
        width * 0.3, 0.8, depth * 0.2
    );

    room.add(table);

    // DRESSER
    const dresserWidth = THREE.MathUtils.randFloat(1.2, 1.8);
    const dresserHeight = THREE.MathUtils.randFloat(1.3, 2);

    const dresser = createDresser(
        width / 2 - 1,
        0.1,
        0,
        dresserWidth,
        dresserHeight,
        dresserDrawers
    );

    room.add(dresser);

    dresser.rotateY(-Math.PI/2);

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

    // POSITION ROOM
    room.position.set(posX, posY, posZ);

    scene.add(room);

    return room;
}

createRoom(
    0, 0, 0,
    10, 10,
    0xD8D2C8,
    0xA68A64,
    0xFFE2A0
);

// Ambient lighting
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);


// Directional lighting
const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;

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

    controls.update();
    //moveCamera(deltaTime);

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