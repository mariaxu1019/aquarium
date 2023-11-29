let detections ={};
const videoElement = document.getElementById('video');

function gotHands(results) {
  detections = results;
}
const hands = new Hands({locateFile: (file) => {
  return `./libraries/mediapipe-hands/${file}`;
}});
hands.setOptions({
  runningMode: "VIDEO",
  delegate: "GPU",
  maxNumHands: 1, 
  modelComplexity: 1, 
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(gotHands);


const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1920,
  height: 708
});
camera.start();