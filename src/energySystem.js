/*
Created by Henry James
henryjaames@gmail.com

Energy system for something story

Use it if you want leik, sick!

Neee bother.

Would love to hear how though!
*/

// save the start time
// this shouldn't live in here, but I feel
// like it's easier to keep it here
import * as SOUND from './sound'
export function saveStartTime() {
    if (checkIfStorage() === true) {
        if (localStorage.getItem("startTime") === null) {
            localStorage.setItem("startTime", String(Date.now()))
        } else {
            // taken from https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates/13904120#13904120
            // get total seconds between the times
            var delta = Math.abs(localStorage.getItem("lastSeen") - Date.now()) / 1000;

            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            var seconds = delta % 60; // in theory the modulus is not required
            if (days > 0) {
                document.getElementById("daysSince").innerHTML = `${days} days since last visit`;
            }
            if (days === 0) {
                if (hours > 0) {
                    document.getElementById("daysSince").innerHTML = `${hours} hours since last visit`;
                }
                if (hours === 0) {
                    if (minutes > 0) {
                        document.getElementById("daysSince").innerHTML = `${minutes} minutes since last visit`;
                    }
                    if (minutes === 0) {
                        if (seconds > 0) {
                            document.getElementById("daysSince").innerHTML = `${seconds} seconds since last visit`;
                        }
                    }
                }
            }
        }
    }
}

// variable to store the energy so I'm not constantly reading from
// local storage, seemed to cause weird glitches on my pc that 
// effected my laptop outside of the browser!?
export let globalEnergy;
export let storageAvailableFlag = false;

export function checkIfStorage() {
    if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        storageAvailableFlag = true;
        return (true);
    } else {
        alert("A storage feature is not available in your browser, the game will not work properly.");
        // Too bad, no localStorage for us
    }
}

// Store the energy levels in local storage
export function initEnergy() {
    if (checkIfStorage() === true) {
        let energyValue = parseInt(readEnergy());
        if (energyValue > 1000) {
            localStorage.setItem("energy", "1000");
        } else if (energyValue < 1000) {
            console.log("Energy level below 1000, keeping last known stats");
        } else {
            localStorage.setItem("energy", "0");
        }
        if (localStorage.getItem("storyTimer") === null) localStorage.setItem("storyTimer", "0");
        if (localStorage.getItem("storyTimer") !== null) SOUND.configureBPM(parseInt(localStorage.getItem("storyTimer")))
    }
}

// Store the energy levels in local storage
export function storeEnergy(energyLevel) {
    localStorage.setItem('energy', String(energyLevel));
}

// to decrease
export function decreaseEnergy(energyDecrease) {
    readEnergy();
    if (globalEnergy > 0) {
        globalEnergy = globalEnergy - energyDecrease;
        storeEnergy(globalEnergy);
    }
}

// to increase
export function increaseEnergy(energyIncrease) {
    readEnergy();
    if (globalEnergy + energyIncrease < 1000) {
        globalEnergy = globalEnergy + energyIncrease
        storeEnergy(globalEnergy);
    }
    if (globalEnergy + energyIncrease > 1000) {
        globalEnergy = 1000
        storeEnergy(1000);
    }
}

// to read
export function readEnergy() {
    if (storageAvailableFlag === true) {
        globalEnergy = (parseInt(localStorage.getItem('energy')));
        return (globalEnergy);
    }
}

// taken for the mozzila MDN site
export function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}