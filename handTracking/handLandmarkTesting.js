function getLandmarkCoordinates(indexArray, detections) {
  const coordinates = {};
  if (detections != undefined && detections.multiHandLandmarks != undefined) {
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      for (let j = 0; j < indexArray.length; j++) {
        let index = indexArray[j];
        let x = detections.multiHandLandmarks[i][index].x * width;
        let y = detections.multiHandLandmarks[i][index].y * height;
        coordinates[index] = { x, y };
      }
    }
  }
  return coordinates;
}

function calculateDistance(pointA, pointB) {
  const deltaX = pointA.x - pointB.x;
  const deltaY = pointA.y - pointB.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function addHandParticle(landmarkCoordinates) {
  for (let i = 0; i < 21; i++) {
    if (i === 4 || i === 8) {
      continue;
    }
    const coord = landmarkCoordinates[i];
    if (coord) {
      const handParticle = new HandParticle(coord.x, coord.y);
      handParticles.push(handParticle);
      const attraction = new toxi.physics2d.behaviors.AttractionBehavior(handParticle, 50, -0.07, 0);
      handAttractions.push(attraction);
    }
  }
}

function drawLandmarks(indexArray, hue) {
  noFill();
  strokeWeight(8);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = indexArray[0]; j < indexArray[1]; j++) {
      let x = detections.multiHandLandmarks[i][j].x * width;
      let y = detections.multiHandLandmarks[i][j].y * height;
      stroke(hue, 40, 255, 100);
      point(x, y);
    }
    endShape();
  }
}

function drawLines(index) {
  stroke(0, 0, 255, 120);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections.multiHandLandmarks[i][index[j]].x * width;
      let y = detections.multiHandLandmarks[i][index[j]].y * height;

      let _x = detections.multiHandLandmarks[i][index[j + 1]].x * width;
      let _y = detections.multiHandLandmarks[i][index[j + 1]].y * height;
      line(x, y, _x, _y);
    }
    endShape();
  }
}

