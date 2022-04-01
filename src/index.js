"use strict";
// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    isMobile,
    getRandomInt,
    scale,
    isEmpty
} from './usefulFunctions.js';
import "./css/normalise.css";
import "./css/main.css";
//////////////////////////////////////////////////////////////////////////////
// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Objects
const geometry = new THREE.IcosahedronGeometry(0.75, 1);

// Materials
const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xfffff);
material.wireframe = true;
material.reflectivity = 0.8;

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
var minPan = new THREE.Vector3(-2, -2, -2);
var maxPan = new THREE.Vector3(2, 2, 2);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enableZoom = false;
controls.maxDistance = 2;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
}
controls.touches = {
    ONE: THREE.TOUCH.DOLLY_PAN
}

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});

var minPan = new THREE.Vector3(-1.5, -1.5, -1.5);
var maxPan = new THREE.Vector3(1.5, 1.5, 1.5);
var _v = new THREE.Vector3();

controls.addEventListener("change", function () {
    _v.copy(controls.target);
    controls.target.clamp(minPan, maxPan);
    _v.sub(controls.target);
    camera.position.sub(_v);
})

renderer.setClearColor(0x000000, 0);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

if (isMobile === true) {
    // only play video when user interacts with piece to give movement
    const mainVideo = document.getElementById('mainVideo');
    window.addEventListener('touchstart', () => {
        mainVideo.play();
    })
    window.addEventListener('touchend', () => {
        mainVideo.pause();
    })
}
if (isMobile === false) {
    // only play video when user interacts with piece to give movement
    const mainVideo = document.getElementById('mainVideo');
    window.addEventListener('mousedown', () => {
        mainVideo.play();
    })
    window.addEventListener('mouseup', () => {
        mainVideo.pause();
    })
}

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.x = 0.2 * elapsedTime;
    sphere.rotation.y = 0.1 * elapsedTime;

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();