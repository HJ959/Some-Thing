"use strict";
// File to house all the tone js code

// import tone
import * as Tone from 'tone'
import {
    getRandomInt
} from './usefulFunctions';
import {
    readEnergy, globalEnergy
} from './energySystem'

//attach a click listener to a play button 
let toneStartFlag = false;

let notes = ["D#4", "E#4", "G#4", "A#4", "C#4", "D#5", "E#5", "G#5", "A#5", "C#5", "G#6", "A#6", "C#6"];
export const happySampleNames = ["happy1", "happy2"];
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
    Tone.Master.volume.value = -10

    // create chorus 
    chorus = new Tone.Chorus({
        "delayTime": 4,
        "depth": 1,
        "feedback": 0.3,
        "spread": 180,
        "wet": 0.6
    }).toDestination().start();

    vocalSamples = new Tone.ToneAudioBuffers({
        happy1: "/media/voices/Happy/happy_1.mp3",
        happy2: "/media/voices/Happy/happy_2.mp3",
    }, () => {
        player = new Tone.Player().connect(chorus);
        // play one of the samples when they all load
        player.buffer = vocalSamples.get(happySampleNames[getRandomInt(0, happySampleNames.length)]);
        player.start();
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