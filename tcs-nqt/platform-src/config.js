/* ATC Developers · TCS NQT Live Test Platform: configuration (edit this file, no other change needed) */
window.CFG={
  brand:"ATC Developers · TCS NQT 2027 Live Practice Test",
  passMark:60,                       // overall % needed for SCORM status "passed"
  speed:1,                           // 1 = real time. Values above 1 speed the clocks up (for testing only)
  judge0:{
    url:"https://ce.judge0.com",     // public Judge0 CE. Replace with your own server or RapidAPI host for heavy use
    headers:{},                      // e.g. {"X-RapidAPI-Key":"xxxx","X-RapidAPI-Host":"judge0-ce.p.rapidapi.com"}
    langs:{c:50,cpp:54,java:62,python:71},
    cpuSec:5, memKB:256000
  },
  proctor:{
    requireCamera:true,              // candidate cannot start without camera
    requireMic:true,                 // candidate cannot start without microphone
    requireFullscreen:true,          // warn when fullscreen is left
    snapshotEverySec:30,             // photo taken every N seconds during the test
    noiseLevel:0.45,                 // 0..1 mic level that counts as "loud noise"
    maxViolations:0,                 // 0 = only warn and record; N = end test after N violations
    faceCheck:true                   // use browser face detection when the browser supports it
  }
};
