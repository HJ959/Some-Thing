"use strict";
// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import * as YUKA from 'yuka';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SOUND from "./sound.js"
import * as ENRGY from './energySystem.js'
import "./css/normalise.css";
import "./css/main.css";
import {
    getRandomInt
} from './usefulFunctions';
//////////////////////////////////////////////////////////////////////////////

// Canvas
const canvas = document.getElementById('webgl');

// init energy system
ENRGY.initEnergy();
ENRGY.saveStartTime();

// Scene
const scene = new THREE.Scene();

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
const targetMesh = new THREE.Mesh(cubeGeo, cubeMat);

// create the YUKA objects for the something
const entityManager = new YUKA.EntityManager();

// create the target and vehicle
const stVehicle = new YUKA.Vehicle();
const target = new YUKA.GameEntity();
target.setRenderComponent(targetMesh, sync);

// create the seeking behaviour
const seekBehaviour = new YUKA.SeekBehavior(target.position);
stVehicle.steering.add(seekBehaviour);

entityManager.add(stVehicle);
entityManager.add(target);

// function to sync the mesh and YUKA 
function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}


// Instantiate a loader
const loader = new GLTFLoader();

let something;
let somethingLoadedFlag = false;
let action, mixer, clips, swimClip, floatClip;
let actionSwim, actionFloat;

// Load a glTF resource
loader.load(
    // resource URL
    'media/somethinganimation.gltf',
    // called when the resource is loaded
    function (gltf) {
        scene.add(gltf.scene);

        gltf.scene.name = "something"
        gltf.scene.castShadow = true;
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        // Create an AnimationMixer, and get the list of AnimationClip instances
        mixer = new THREE.AnimationMixer(gltf.scene);
        clips = gltf.animations;

        // Play a specific animation
        swimClip = THREE.AnimationClip.findByName(clips, 'swim');
        floatClip = THREE.AnimationClip.findByName(clips, 'float');
        actionFloat = mixer.clipAction(floatClip);
        actionSwim = mixer.clipAction(swimClip);
        actionSwim.play();

        // grab the something once its loaded and mark as loaded
        something = scene.getObjectByName("something")
        somethingLoadedFlag = true;

        // disable for YUKA
        gltf.scene.matrixAutoUpdate = false;

        // move to random first
        target.position.x = (getRandomInt(-40, 40) * 0.1);
        target.position.y = (getRandomInt(-40, 40) * 0.1);
        target.position.z = (getRandomInt(-20, 7) * 0.1);


        // moosh the YUKA 'soul' with the three 'body'
        stVehicle.setRenderComponent(gltf.scene, sync);
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

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight(0x76a0cf, 1);
scene.add(directionalLight);

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
controls.maxDistance = 3.5;
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
// renderer.setClearColor(0x000000, 0); // the default
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
let delta;
let teleportCount = 0;
const triggerSpeakIntervals = [200, 100, 300, 400, 500, 600, 700];
let secondsSinceStart;
const tick = () => {
    // every now and then during the session, store the time 
    // into a local storage var called lastseen
    if (saveCount % 300 === 0) {
        // save the time in local storage 
        localStorage.setItem('lastSeen', String(Date.now()));
        saveCount = 0;
    }
    saveCount++;

    // every now and then the something teleports
    if (teleportCount % parseInt(triggerSpeakIntervals[getRandomInt(0, triggerSpeakIntervals.length)]) === 0) {
        // read the time for working out when speaking should happen
        secondsSinceStart = returnTime();
        if (somethingLoadedFlag === true && SOUND.toneStartFlag === true) {
            // if the something is happy play happy noises
            if (ENRGY.globalEnergy > 800) {
                if (secondsSinceStart < 60) SOUND.player.buffer = SOUND.vocalSamples.get(SOUND.happySampleNames[getRandomInt(0, SOUND.happySampleNames.length)]);
                if (secondsSinceStart > 60) SOUND.player.buffer = SOUND.vocalSamples.get(SOUND.garbledSamples[getRandomInt(0, SOUND.garbledSamples.length)]);

            }

            // if the something is medium happy play medium happy noises
            if (ENRGY.globalEnergy < 799 && ENRGY.globalEnergy > 600) {
                SOUND.player.buffer = SOUND.vocalSamples.get(SOUND.mediumHappySampleNames[getRandomInt(0, SOUND.mediumHappySampleNames.length)]);
            }

            // if the something is medium play medium noises
            if (ENRGY.globalEnergy < 599 && ENRGY.globalEnergy > 400) {
                SOUND.player.buffer = SOUND.vocalSamples.get(SOUND.mediumSampleNames[getRandomInt(0, SOUND.mediumSampleNames.length)]);
            }

            // if the something is angry play angry noises
            if (ENRGY.globalEnergy < 399 && ENRGY.globalEnergy > 200) {
                SOUND.player.buffer = SOUND.vocalSamples.get(SOUND.angrySampleNames[getRandomInt(0, SOUND.angrySampleNames.length)]);
            }

            // if the something is fedup play fedup noises
            if (ENRGY.globalEnergy < 199) {
                SOUND.player.buffer = SOUND.vocalSamples.get(SOUND.fedupSampleNames[getRandomInt(0, SOUND.fedupSampleNames.length)]);
            }

            SOUND.player.start();
        }
        teleportCount = 0;
    }
    teleportCount++;

    // gradually decrease the energy if its more than 0
    if (liveEnergyCounter % 10 === 0) {
        // decrease energy
        ENRGY.decreaseEnergy(1);
        liveEnergyCounter = 0;

        canvas.style.filter = "brightness(" + ENRGY.globalEnergy * 0.001 + ") saturate(" + ENRGY.globalEnergy * 0.001 + ") blur(" + (1000 - ENRGY.globalEnergy) * 0.005 + "px)";
    }
    if (mouseDownFlag === true) {
        // figure out the time now the mouse is up
        const mouseupTime = new Date().getTime(),
            timeDifference = (mouseupTime - mousedownTime) * 0.005;
        ENRGY.increaseEnergy(timeDifference);
    }

    if (somethingLoadedFlag === true) {
        meshDetails.rotation.z += 0.0001;
        meshOne.rotation.z -= 0.0001;

        // if the target and vehicle are same pos chill
        if ((Math.abs(target.position.x - stVehicle.position.x) * 10 < 10) &&
            Math.abs(target.position.y - stVehicle.position.y) * 10 < 10 &&
            Math.abs(target.position.z - stVehicle.position.z) * 10 < 10) {
            target.position.x = (getRandomInt(-40, 40) * 0.1);
            target.position.y = (getRandomInt(-40, 40) * 0.1);
            target.position.z = (getRandomInt(-10, 7) * 0.1);
        }
    }

    delta = clock.getDelta()
    if (mixer) {
        mixer.update(delta);
    }

    // const yDelta = yTime.update().getDelta();
    entityManager.update(delta);


    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();


//// function for working out time
function returnTime() {
    return (Math.abs((localStorage.getItem("startTime") - Date.now()) / 1000))
}
