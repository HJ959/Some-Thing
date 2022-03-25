// "use strict";

// let startStopFlag = 'Loading';

// // user functionality vars
// let pressToStartDiv = document.getElementById('pressToStartDiv');

// /* Get the documentElement (<html>) to display the page in fullscreen */
// var elem = document.documentElement;

// /* View in fullscreen */
// function openFullscreen() {
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) {
//     /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) {
//     /* IE11 */
//     elem.msRequestFullscreen();
//   }
//   document.body.style.cursor = 'none';
// }

// /* Close fullscreen */
// function closeFullscreen() {
//   if (document.exitFullscreen) {
//     document.exitFullscreen();
//   } else if (document.webkitExitFullscreen) {
//     /* Safari */
//     document.webkitExitFullscreen();
    
//   } else if (document.msExitFullscreen) {
//     /* IE11 */
//     document.msExitFullscreen();
//   }
//   document.body.style.cursor = 'auto';
// }

// // if the user leaves the tab and it becomes inactive stop playing sound and video
// document.addEventListener("visibilitychange", event => {
//   if (document.visibilityState != "visible") {
//     if (startStopFlag === 'Stop' && pageLoadedFlag === true) {
//       filter.stop();
//       oscOne.stop();
//       oscTwo.stop();
//       oscThree.stop();
//       oscFour.stop();
//       player.pauseVideo();
//       playerTwo.pauseVideo();
//       if (isMobile === false) {
//         playerThree.pauseVideo();
//         reverb.wet.value = 0;
//       }

//       startStopFlag = 'Start'
//     }
//   }
// });

// // if mousedown event un mute all youtube videos
// document.querySelector('#wholePage')?.addEventListener('mousedown', function (event) {
//   if (startStopFlag === "readyForFirstClick" && pageLoadedFlag === true) {
//     Tone.start()
//     console.log('audio is ready')
//     // call the sound and video elements now we have the weather data
//     droneSynth();
//     window.requestAnimationFrame(step);

//     player.seekTo(getRandomInt(0, 7200));
//     playerTwo.seekTo(getRandomInt(0, 7200));

//     document.getElementById("playerOne").style.webkitFilter = currentCloudsCSSFilter;
//     document.getElementById("playerOne").style.filter = currentCloudsCSSFilter;

//     document.getElementById("playerTwo").style.webkitFilter = currentCloudsCSSFilter;
//     document.getElementById("playerTwo").style.filter = currentCloudsCSSFilter;

//     if (isMobile === false) {
//       playerThree.seekTo(getRandomInt(0, 7200));
//       document.getElementById("playerThree").style.webkitFilter = currentCloudsCSSFilter;
//       document.getElementById("playerThree").style.filter = currentCloudsCSSFilter;
//     }

//     startStopFlag = 'Start';
//   }
//   // if mousedown and the flag is set to Start
//   if (startStopFlag === 'Start') {
//     pressToStartDiv.style.display = "none";
//     oscOne.start();
//     oscTwo.start();
//     oscThree.start();
//     oscFour.start();


//     player.playVideo();
//     playerTwo.playVideo();
//     player.unMute();
//     playerTwo.unMute();

//     if (isMobile === false) {
//       reverb.wet.value = 0.5
//       playerThree.playVideo();
//       playerThree.unMute();
//     }
//     startStopFlag = 'Stop';
//     openFullscreen();

//     return
//   }
//   // if mousedown and the flag is set to Start
//   if (startStopFlag === 'Stop') {
//     pressToStartDiv.style.display = "grid";
//     document.getElementById('waitingText').innerHTML = "Paused, tap screen to start, tap screen to stop! Press spacebar or swipe up to view live mapping table.";
//     oscOne.stop();
//     oscTwo.stop();
//     oscThree.stop();
//     oscFour.stop();


//     player.pauseVideo();
//     playerTwo.pauseVideo();
//     if (isMobile === false) {
//       playerThree.pauseVideo();
//       reverb.wet.value = 0;
//     }

//     startStopFlag = 'Start'
//     closeFullscreen();
//     return
//   }
// });

// // if space bar is pressed or a swipe up bring up the current data info screen and search
// let firstSpacePress = true;

// function toggleTableDiv() {
//   if (firstSpacePress === true) {
//     updateLiveTable();
//     firstSpacePress = false;
//   }
//   if (infoScreenFlag === false) {
//     document.getElementById("infoSearchScreen").style.display = "grid";
//   } else {
//     document.getElementById("infoSearchScreen").style.display = "none";
//   }
//   infoScreenFlag = !infoScreenFlag;
// }

// document.body.onkeyup = function (e) {
//   if (e.keyCode == 32 || e.key === ' ') {
//     toggleTableDiv();
//   }
// }

// // taken from https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
// let touchstartY = 0;
// let touchendY = 0;

// const slider = document.getElementById('wholePage');

// function handleGesture() {
//   if (touchendY < touchstartY) {
//     toggleTableDiv();
//   }
// }

// slider.addEventListener('touchstart', e => {
//   touchstartY = e.changedTouches[0].screenY;
// })

// slider.addEventListener('touchend', e => {
//   touchendY = e.changedTouches[0].screenY;
//   handleGesture();
// })