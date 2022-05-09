"use strict";
// File to house all the tone js code

// import tone
import * as Tone from 'tone'
import {
    getRandomInt
} from './usefulFunctions';

//attach a click listener to a play button 
let toneStartFlag = false;

let notes = ["D#4", "E#4", "G#4", "A#4", "C#4", "D#5", "E#5", "G#5", "A#5", "C#5", "G#6", "A#6", "C#6"];
const sampleNames = ["happy1", "happy2"];
const vocalSamples = [];
var player;

window.addEventListener('pointerdown', () => {
    // if audio isn't setup then call the async function
    if (toneStartFlag === false) setup();
    // speed up if we move
    if (toneStartFlag === true) Tone.Transport.start(); Tone.Transport.bpm.rampTo(getRandomInt(180,220), 0.1);
})
window.addEventListener('pointerup', () => {
    // slow down when we stop
    // if (toneStartFlag === true) Tone.Transport.bpm.rampTo(0, 0.1);
    if (toneStartFlag === true) Tone.Transport.pause();
})

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
        player.buffer = vocalSamples.get(sampleNames[getRandomInt(0,sampleNames.length)]);
        player.start();
    });

    // create the synth
    const synth = new Tone.PolySynth().toDestination();
    // set the attributes across all the voices using 'set'
    synth.set({
        detune: -1200,
        volume: -12
    });

    const loop = new Tone.Loop((time) => {
        // triggered every eighth note.
        synth.triggerAttackRelease(notes[getRandomInt(0, notes.length)], 0.3);

    }, "8n", );
    loop.humanize = true;
    loop.start(0);

    Tone.Transport.start();
}
