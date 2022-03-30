"use strict";
// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import {
    isMobile,
    getRandomInt,
    scale,
    isEmpty
} from './usefulFunctions.js';
import "./css/normalise.css";
import "./css/main.css";
//////////////////////////////////////////////////////////////////////////////
let pageLoadedFlag = false;
window.onload = function () {
    pageLoadedFlag = true;
}
//////////////////////////////////////////////////////////////////////////////

// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(.9, .1, 32, 100);

// grab the video and create a video texture
const video = document.getElementById('texture');
const texture = new THREE.VideoTexture(video);

// Materials
const material = new THREE.MeshBasicMaterial({map: texture});
material.color = new THREE.Color(0xfffff);
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


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
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
let mouseX, mouseY;
onmousemove = function(e){
    mouseX = e.clientX; 
    mouseY = e.clientY;
}

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.x = (mouseX * 0.0001);
    sphere.rotation.y = (mouseY * 0.0001);

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();