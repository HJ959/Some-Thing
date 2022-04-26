"use strict";
// File to house all the tone js code

// import tone
import * as Tone from 'tone'
import { Volume } from 'tone';
import {
    getRandomInt,
    isMobile
} from './usefulFunctions';

//attach a click listener to a play button 
let toneStartFlag = false;
if (isMobile === false) {
    document.querySelector('main').addEventListener('click', async () => {
        if (toneStartFlag === false) {
            setup();
        }
    })
}
if (isMobile === true) {
    document.querySelector('main').addEventListener('ontouch', async () => {
        if (toneStartFlag === false) {
            setup();
        }
    })
}

let notes = ["D#4", "E#4", "G#4", "A#4", "C#4", "D#5", "E#5", "G#5", "A#5", "C#5", "G#6", "A#6", "C#6"];
const vocalSamples = [];
var player;

async function setup() {
    await Tone.start()
    console.log('audio is ready')
    toneStartFlag = true;

    const vocalSamples = new Tone.ToneAudioBuffers({
        happy1: "/media/voiceHappy/happy_1.mp3",
        happy2: "/media/voiceHappy/happy_2.mp3",
    }, () => {
        player = new Tone.Player().toDestination();
        // play one of the samples when they all load
        player.buffer = vocalSamples.get("happy1");
        player.start();
    });

    // create the synth
    const synth = new Tone.PolySynth().toDestination();
    // set the attributes across all the voices using 'set'
    synth.set({
        detune: -1200,
        volume: -12
    });

    // create the pad
    const synthPad = new Tone.PolySynth().toDestination();
    // set the attributes across all the voices using 'set'
    synth.set({
        detune: -1200,
        volume: -24
    });


    const loop = new Tone.Loop((time) => {
        // triggered every eighth note.
        synth.triggerAttackRelease(notes[getRandomInt(0, notes.length)], 0.1);
        synth.triggerAttackRelease(notes.slice(3,6), 0.5);

    }, "8n", );
    loop.humanize = true;
    loop.start(0);

    Tone.Transport.start();
}


if (isMobile === true) {
    // only play video when user interacts with piece to give movement
    const mainVideo = document.getElementById('mainVideo');
    window.addEventListener('touchstart', () => {
        Tone.Transport.bpm.rampTo(200, 0.1);
    })
    window.addEventListener('touchend', () => {
        Tone.Transport.bpm.rampTo(0, 0.2);
    })
}
if (isMobile === false) {
    // only play video when user interacts with piece to give movement
    const mainVideo = document.getElementById('mainVideo');
    window.addEventListener('mousedown', () => {
        Tone.Transport.bpm.rampTo(200, 0.1);
    })
    window.addEventListener('mouseup', () => {
        Tone.Transport.bpm.rampTo(0, 0.2);
    })
}