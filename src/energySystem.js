/*
Created by Henry James
henryjaames@gmail.com

Energy system for something story

Use it if you want leik, sick!

Neee bother.

Would love to hear how though!
*/

function checkIfStorage() {
    if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        return(true);   
    }
    else {
        alert("A storage feature is not available in your browser, the game will not function properly.");
        // Too bad, no localStorage for us
    }
}

// Store the energy levels in local storage
function storeEnergy(energyLevel) {
    if (checkIfStorage() === true) localStorage.setItem('energy', String(energyLevel));
}

// to decrease
function decreaseEnergy(energyDecrease) {
    storeEnergy(readEnergy() - energyDecrease);
}

// to increase
function increaseEnergy(energyIncrease) {
    storeEnergy(readEnergy() + energyIncrease);
}

// to read
function readEnergy() {
    if (checkIfStorage() === true) return(parseInt(localStorage.getItem('energy')));
}

// taken for the mozzila MDN site
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
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