"use strict";
// File to house all the tone js code

// import tone
import * as Tone from 'tone'

//attach a click listener to a play button
let toneStartFlag = false;
document.querySelector('main').addEventListener('click', async () => {
    if (toneStartFlag === false) {
        await Tone.start()
        console.log('audio is ready')
        toneStartFlag = true;
        // setup();
    }
})

function setup() {
    const osc = new Tone.Oscillator().toDestination();
    // repeated event every 8th note
    Tone.Transport.scheduleRepeat((time) => {
        // use the callback time to schedule events
        osc.start(time).stop(time + 0.1);
    }, "2n");
    // transport must be started before it starts invoking events
    Tone.Transport.start();
    Tone.Transport.bpm.value = 180;
}