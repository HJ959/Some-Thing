"use strict";
// File to house all the tone js code

// import tone
import * as Tone from 'tone'
import {
    getRandomInt,
    isMobile
} from './usefulFunctions';

//attach a click listener to a play button 
let toneStartFlag = false;
if (isMobile === false) {
    document.querySelector('main').addEventListener('click', async () => {
        if (toneStartFlag === false) {
            await Tone.start()
            console.log('audio is ready')
            toneStartFlag = true;
            setup();
        }
    })
}
if (isMobile === true) {
    document.querySelector('main').addEventListener('ontouch', async () => {
        if (toneStartFlag === false) {
            await Tone.start()
            console.log('audio is ready')
            toneStartFlag = true;
            setup();
        }
    })
}
let notes = ["D#4", "E#4", "G#4", "A#4", "C#4", "D#5", "E#5", "G#5", "A#5", "C#5"];

function setup() {

    // create the synth
    const synth = new Tone.PolySynth().toDestination();
    // set the attributes across all the voices using 'set'
    synth.set({
        detune: -1200
    });

    // CREATE a gain

    const loop = new Tone.Loop((time) => {
        // triggered every eighth note.
        synth.triggerAttackRelease(notes[getRandomInt(0, notes.length)], 0.1);

    }, "8n").start(0);

    Tone.Transport.start();
}


if (isMobile === true) {
    // only play video when user interacts with piece to give movement
    const mainVideo = document.getElementById('mainVideo');
    window.addEventListener('touchstart', () => {
        Tone.Transport.bpm.rampTo(200, 0.1);
    })
    window.addEventListener('touchend', () => {
        Tone.Transport.bpm.rampTo(20, 0.2);
    })
}
if (isMobile === false) {
    // only play video when user interacts with piece to give movement
    const mainVideo = document.getElementById('mainVideo');
    window.addEventListener('mousedown', () => {
        Tone.Transport.bpm.rampTo(200, 0.1);
    })
    window.addEventListener('mouseup', () => {
        Tone.Transport.bpm.rampTo(20, 0.2);
    })
}