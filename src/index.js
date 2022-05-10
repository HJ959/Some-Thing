"use strict";
// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import {
//     SteeringEntity
// } from './three-steer';
// import {
//     isMobile,
//     getRandomInt,
//     scale,
//     isEmpty
// } from './usefulFunctions.js';
import * as SOUND from "./sound.js"
import * as ENRGY from './energySystem.js'
import "./css/normalise.css";
import "./css/main.css";
import { getRandomInt } from './usefulFunctions';
//////////////////////////////////////////////////////////////////////////////
let entityManager, time, vehicle, target;

// Canvas
const canvas = document.getElementById('webgl');

// init energy system
ENRGY.initEnergy();
ENRGY.saveStartTime();

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 0.1, 20)
// scene.background = new THREE.Color(0x000000);

// Instantiate a loader
const loader = new GLTFLoader();

let something;
let somethingLoadedFlag = false;
let action, mixer, clips, clip;
let floatAction, swimAction;

// Load a glTF resource
loader.load(
    // resource URL
    'media/somethinganimation.gltf',
    // called when the resource is loaded
    function (gltf) {
        scene.add(gltf.scene);
        // let entity = new SteeringEntity(gltf.scene);
        // scene.add(entity);

        // Create an AnimationMixer, and get the list of AnimationClip instances
        mixer = new THREE.AnimationMixer(gltf.scene);
        clips = gltf.animations;

        // Play a specific animation
        clip = THREE.AnimationClip.findByName(clips, 'float');
        action = mixer.clipAction(clip);
        action.play();

        gltf.scene.name = "something"
        gltf.scene.castShadow = true;
        gltf.scene.scale.set(0.6, 0.6, 0.6);
        gltf.scene.translateX(getRandomInt(-2,2));
        gltf.scene.translateZ(getRandomInt(-1,1));
        gltf.scene.translateY(getRandomInt(-2,2));
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        // grab the something once its loaded and mark as loaded
        something = scene.getObjectByName("something")
        somethingLoadedFlag = true;
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened');
    }
);

const importTexture = async (url, material) => {
    const loader = new THREE.TextureLoader();
    const texture = await loader.loadAsync(url);
    material.map = texture;
    material.transparent = true;
    material.needsUpdate = true;
    return texture;
}

//usage
const mapGeo = new THREE.PlaneGeometry(7, 7);

const matDetails = new THREE.MeshBasicMaterial();
const meshDetails = new THREE.Mesh(mapGeo, matDetails);
meshDetails.translateZ(-0.5);
meshDetails.castShadow = true;
scene.add(meshDetails);

const matOne = new THREE.MeshBasicMaterial();
const meshOne = new THREE.Mesh(mapGeo, matOne);
meshOne.translateZ(-0.8);
meshOne.castShadow = true;
scene.add(meshOne);

const matTwo = new THREE.MeshBasicMaterial();
const meshTwo = new THREE.Mesh(mapGeo, matTwo);
meshTwo.translateZ(-2.7);
meshTwo.castShadow = true;
scene.add(meshTwo);

const matThree = new THREE.MeshBasicMaterial();
const meshThree = new THREE.Mesh(mapGeo, matThree);
meshThree.translateZ(-1.7);
meshThree.castShadow = true;
scene.add(meshThree);

//this is asynchronous
importTexture('media/details.png', matDetails);
importTexture('media/map_1.png', matOne);
importTexture('media/map_2.png', matTwo);
importTexture('media/map_3.png', matThree);

// Lights
// white spotlight shining from the side, casting a shadow

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add(spotLight);

// Sizes
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableZoom = true;
controls.maxDistance = 2.5;
controls.minDistance = 1;

// set up the controls, which buttons and touches do what
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
controls.touches.ONE = THREE.TOUCH.PAN;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setClearColor(0x000000, 0); // the default
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// this bit sets up boundaries for the pan, effectively 
// creating the edges of the 'map'
var minPan = new THREE.Vector3(-4, -4, -4);
var maxPan = new THREE.Vector3(4, 4, 4);
var _v = new THREE.Vector3();
controls.addEventListener("change", function () {
    _v.copy(controls.target);
    controls.target.clamp(minPan, maxPan);
    _v.sub(controls.target);
    camera.position.sub(_v);
})


// keep the same size even if window is resized
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

let mousedownTime;
let mouseDownFlag = false;
let playPromise;

// only play video when user interacts with piece to give movement
const mainVideo = document.getElementById('mainVideo');
window.addEventListener('pointerdown', () => {
    mousedownTime = new Date().getTime();
    mouseDownFlag = true;
    playPromise = mainVideo.play();
})
window.addEventListener('pointerup', () => {
    // stop the incrementing saturation
    mouseDownFlag = false;
    // make sure there's something playing to pause
    if (playPromise !== undefined) {
        mainVideo.pause();
    }
})

const clock = new THREE.Clock();
let saveCount = 0;
let liveEnergyCounter = 0;
let currentEnergy;
let delta;
let teleportCount = 0;
let energy;

const tick = () => {
    energy = ENRGY.readEnergy();
    // every now and then during the session, store the time 
    // into a local storage var called lastseen
    if (saveCount % 300 === 0) {
        // save the time in local storage 
        localStorage.setItem('lastSeen', String(Date.now()));
        saveCount = 0;
    }
    saveCount++;

    // every now and then the something teleports
    if (teleportCount % parseInt(300) === 0) {
        if (somethingLoadedFlag === true) {
            something.position.x = (getRandomInt(-2,2));
            something.position.y = (getRandomInt(-2,2));
            something.position.z = (getRandomInt(-1,1));
            
            // if the something is happy play happy noises
            if (energy > 700) {
                SOUND.player.buffer = SOUND.vocalSamples.get(SOUND.happySampleNames[getRandomInt(0, SOUND.happySampleNames.length)]);
                SOUND.player.start();
            }
        }
        teleportCount = 0;
    }
    teleportCount++;

    // gradually decrease the energy if its more than 0
    if (liveEnergyCounter % 1000000 === 0) {
        // decrease energy
        currentEnergy = ENRGY.decreaseEnergy(1);
        liveEnergyCounter = 0;

        canvas.style.filter = "saturate(" + currentEnergy * 0.001 + ") blur(" + (1000 - currentEnergy) * 0.001 + "px)";
    }
    if (mouseDownFlag === true) {
        // figure out the time now the mouse is up
        const mouseupTime = new Date().getTime(),
            timeDifference = (mouseupTime - mousedownTime) * 0.005;
        ENRGY.increaseEnergy(timeDifference);
    }

    if (somethingLoadedFlag === true) {
        something.rotation.x += 0.001;
        something.rotation.z += 0.001;
        meshDetails.rotation.z += 0.0001;
        meshOne.rotation.z -= 0.0001;
    }

    delta = clock.getDelta()
    if (mixer) {
        mixer.update(delta);
    }


    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();
