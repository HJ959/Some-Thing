"use strict";
// File to house all the tone js code

// import tone
import * as Tone from 'tone'
import {
    getRandomInt,
    isMobile
} from './usefulFunctions';
import {
    readEnergy,
    globalEnergy
} from './energySystem'

// has tonestarted?
export let toneStartFlag = false;

let notes = ["D#4", "E#4", "G#4", "A#4", "C#4", "D#5", "E#5", "G#5", "A#5", "C#5", "G#6", "A#6", "C#6", 'F4', 'G4', "G5", "A5", "C5", "G6", "A6", "C6", "G4", "A4", "C4", "D5"];

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

// story assets file names
export const sadSamples = ["sad_youvebeengonehours", "sad_wheredidyougoforhalfanhour", "sad_howmanydays", "sad_darkwhenleave"]
export const normalConfusedSamples = ["normalConfused_trappedinnonsense", "normalConfused_icanfeelyourhand", "normalConfused_howdidigethere", "normalConfused_beenhereawhile"]
export const normalSamples = ["normal_needyourhelp", "normal_lightdisolving", "normal_getback", "normal_dreamawake"]
export const garbledSamples = ["garbled_wherkjer", "garbled_whereami", "garbled_lookinatme", "garbled_jgfkdj", "garbled_howdidiget", "garbled_hello", "garbled_bodyfeelstrange"]
export const excitedSamples = ["excited_souldtrappedonweb", "excited_ithinkirememeber", "excited_suckedinmyphone", "excited_zapped", "excited_folderintwo", "excited_youfoundme", "excited_swimmingaround", "excited_iwasasomething", "excited_iwasaperson", "excited_imaspirit", "excited_iremember", "excited_nextplace", "excited_litup", "excited_imbeingpulled"]
export const endSamples = ["end_thankyou", "end_imsplippinaway", "end_imfree", "end_byeeeee"]

const allStorySampleNames = [];
allStorySampleNames.push(...sadSamples, ...normalConfusedSamples, ...normalSamples, ...garbledSamples, ...excitedSamples, ...endSamples);

for (var i = 0; i < allStorySampleNames.length; i++) {
    sampleLocations[allStorySampleNames[i]] = `/media/storyAssets/${allStorySampleNames[i]}.mp3`
}

let firstTimeDown = true;
export let synth, loop, player, vocalSamples, chorus;
let musicBPM = 80;
export function increaseBPM() {
    musicBPM+=9;
}

function handlePointerDown() {
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
        firstTimeDown = false;
    }
    // if audio isn't setup then call the async function
    if (toneStartFlag === false) setup();

    if (firstTimeDown === false) {
        // speed up if we move
        if (toneStartFlag === true) {
            Tone.Transport.start();
            Tone.Transport.bpm.rampTo(getRandomInt(musicBPM - 20, musicBPM), 0.1);
        }
    }
}
document.addEventListener('pointerdown', handlePointerDown);
// document.removeEventListener('pointerdown', handlePointerDown);

function handlePointerUp() {
    if (toneStartFlag === true) Tone.Transport.pause();
}
document.addEventListener('pointerup', handlePointerUp);
// document.removeEventListener('pointerup', handlePointerUp);

async function setup() {
    await Tone.start();
    createAudioElements();
}

function createAudioElements() {
    // create chorus 
    chorus = new Tone.Chorus({
        "delayTime": 4,
        "depth": 1,
        "feedback": 0.3,
        "spread": 180,
        "wet": 0.6
    }).toDestination().start();

    const feedbackDelay = new Tone.FeedbackDelay({
        "delayTime": 0.1,
        "feedback": 0.4,
        "wet": 0.1
    }).toDestination();

    vocalSamples = new Tone.ToneAudioBuffers(
        sampleLocations,
        () => {
            player = new Tone.Player({
                volume: -6
            }).connect(chorus).connect(feedbackDelay);
        });

    // create the synth
    synth = new Tone.PolySynth().connect(chorus);
    // set the attributes across all the voices using 'set'
    synth.set({
        detune: -1200,
        volume: -24
    });

    loop = new Tone.Loop((time) => {
        pattern();
    }, "8n");
    loop.humanize = true;
    loop.start(0);

    Tone.Transport.start();
    toneStartFlag = true;
}

let notesToPlay;
// gets called each loop
function pattern() {
    readEnergy();
    chorus.wet.value = Math.abs((1000 - globalEnergy) * 0.001);

    // if all happy play only the notes that sound happy
    if (globalEnergy > 800) notesToPlay = 12;

    // then start slipping in more not nice notes
    if (globalEnergy < 799 && globalEnergy > 600) notesToPlay = 16;
    if (globalEnergy < 599 && globalEnergy > 400) notesToPlay = 18;
    if (globalEnergy < 399 && globalEnergy > 200) notesToPlay = 20;
    if (globalEnergy < 199) notesToPlay = notes.length;

    synth.triggerAttackRelease(notes[getRandomInt(0, notesToPlay)], (getRandomInt(1, 100) * 0.01));
}