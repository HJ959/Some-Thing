"use strict";
// File to house all the tone js code

// import tone
import * as Tone from 'tone'
import {
    getRandomInt
} from './usefulFunctions';
import {
    readEnergy,
    globalEnergy
} from './energySystem'

//attach a click listener to a play button 
let toneStartFlag = false;

let notes = ["D#4", "E#4", "G#4", "A#4", "C#4", "D#5", "E#5", "G#5", "A#5", "C#5", "G#6", "A#6", "C#6"];

// these are the names of the various mp3s for use in dynamically creating objects
export const happySampleNames = ["happy_1", "happy_2", "happy_3", "happy_4", "happy_5", "happy_6"];
export const mediumHappySampleNames = ["mHappy_1", "mHappy_2", "mHappy_3"];
export const mediumSampleNames = ["medium_1", "medium_2", "medium_3"];
export const angrySampleNames = ["angry_1", "angry_2", "angry_3", "angry_4", "angry_5"];
export const fedupSampleNames = ["fedup_1", "fedup_2", "fedup_3", "fedup_4", "fedup_5", "fedup_6"];
let sampleLocations = {};
const allSampleNames = [];
allSampleNames.push(...happySampleNames, ...mediumHappySampleNames, ...mediumSampleNames, ...angrySampleNames, ...fedupSampleNames);

for (var i = 0; i < allSampleNames.length; i++) {
    sampleLocations[allSampleNames[i]] = `/media/voice_noises/${allSampleNames[i]}.mp3`
}

let firstTimeDown = true;
export let synth, loop, player, vocalSamples, chorus;

window.addEventListener('pointerdown', () => {
    if (firstTimeDown === true) {
        const show = document.getElementsByClassName("show");
        const hide = document.getElementsByClassName("hide");
        // once object loaded change the landing text
        for (var i = 0; i < show.length; i++) {
            show[i].style.display = "none";
        }
        for (var i = 0; i < hide.length; i++) {
            hide[i].style.display = "block";
        }
    }
    // if audio isn't setup then call the async function
    if (toneStartFlag === false) setup();
    // speed up if we move
    if (toneStartFlag === true) {
        Tone.Transport.start();
        Tone.Transport.bpm.rampTo(getRandomInt(180, 220), 0.1);

    }
})
window.addEventListener('pointerup', () => {
    if (toneStartFlag === true) Tone.Transport.pause();
})

async function setup() {
    await Tone.start()
    console.log('audio is ready')
    toneStartFlag = true;
    Tone.Destination.volume.value = -12

    // create chorus 
    chorus = new Tone.Chorus({
        "delayTime": 4,
        "depth": 1,
        "feedback": 0.3,
        "spread": 180,
        "wet": 0.6
    }).toDestination().start();

    vocalSamples = new Tone.ToneAudioBuffers(
        sampleLocations,
        () => {
            player = new Tone.Player().connect(chorus);
        });

    // create the synth
    synth = new Tone.PolySynth().connect(chorus);
    // set the attributes across all the voices using 'set'
    synth.set({
        detune: -1200,
        volume: -12
    });

    loop = new Tone.Loop((time) => {
        // triggered every eighth note.
        //synth.triggerAttackRelease(notes[getRandomInt(0, notes.length)], (getRandomInt(1,6)*0.1));
        pattern();
    }, "8n", );
    loop.humanize = true;
    loop.start(0);

    Tone.Transport.start();
}

// gets called each loop
function pattern() {
    readEnergy();
    chorus.wet.value = Math.abs((1000 - globalEnergy) * 0.001);
    synth.triggerAttackRelease(notes[getRandomInt(0, notes.length)], (getRandomInt(1, 100) * 0.01));
}