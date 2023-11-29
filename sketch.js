let physics;
let tailPhysics;

let particleGrabRadius = 30;

let handParticles = [];
let handAttractions = [];
const pinchThreshold = 50;
let canvas;

let draggedParticle = null;
let attraction;

function setup() {
  let ratio = 4.2/1.7;
  let canvasWidth = 1920; 
  let canvasHeight = canvasWidth/ratio;
  console.log(canvasHeight);
  canvas = createCanvas(canvasWidth/2, canvasHeight/2);
  canvas.id("canvas");

  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));
  physics.setDrag(0.001);
  let gb0 =  new GravityBehavior(new Vec2D(0, -0.001));
  physics.addBehavior(gb0);

  tailPhysics = new VerletPhysics2D();
  tailPhysics.setWorldBounds(new Rect(0, 0, width, height));
  let gb = new GravityBehavior(new Vec2D(0, 0.05));
  tailPhysics.addBehavior(gb);
  tailPhysics.setDrag(0.001);

  attraction = new AttractionBehavior(new Vec2D(0, 0), 500, 0.5, 0.2);
  physics.addBehavior(attraction);

  colorMode(HSB, 255);
  frameRate(60);

  createStars();
  createParticleNetrwork();
  createTreeCell();
  createDNA();
  createButterfly();
}

function draw() {
  clear();
  stroke(255);
  noFill();
  physics.update();
  tailPhysics.update();

  drawHand();

  handDetected();
  pinchInteraction();

  drawStars();
  drawParticleNetwork();
  drawTreeCell();
  drawDNA();
  drawButterfly();
}

function handDetected() {
  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }
  for (let i = 0; i < handParticles.length; i++) {
    const index = allLandmarkIndices[i];
    if (index == 8 || index == 4) {
      continue;
    }
    const coord = allLandmarkCoordinates[index];
    if (coord) {
      handParticles[i].updatePosition(coord.x, coord.y);
    }

    if (tailPhysics.behaviors.length < tailPhysics.particles.length + 19) {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      tailPhysics.addBehavior(handAttractions[i]);
    } else {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
    }

    if (physics.behaviors.length < physics.particles.length + 19) {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      physics.addBehavior(handAttractions[i]);
    } else {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
    }
  }
}

function pinchInteraction() {
  const landmarkIndices = [8, 4];
  const landmarkCoordinates = getLandmarkCoordinates(landmarkIndices, detections);

  if (landmarkCoordinates[8] && landmarkCoordinates[4]) {
    const distance = calculateDistance(landmarkCoordinates[8], landmarkCoordinates[4]);

    if (distance < pinchThreshold) {
      const midpoint = {
        x: (landmarkCoordinates[8].x + landmarkCoordinates[4].x) / 2,
        y: (landmarkCoordinates[8].y + landmarkCoordinates[4].y) / 2
      };
      fill(255);
      noStroke();
      ellipse(midpoint.x, midpoint.y, 20, 20);

      attraction.setAttractor(new Vec2D(midpoint.x, midpoint.y));
      attraction.setStrength(0.1);

      for (let dna of dnas) {
        for (let i = 0; i < 2; i++) {
            let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);
            if (d < 20) {
              dna.particles[i].set(random(midpoint.x-100,midpoint.x+100), random(midpoint.y-100,midpoint.y+100));
          }
        } 

        for (let i = dna.particles.length - 2; i < dna.particles.length; i++) {
            let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);
            if (d < 20) {
                dna.particles[i].set(random(midpoint.x-100,midpoint.x+100), random(midpoint.y-100,midpoint.y+100));
            }
        }
      }
      let d = calculateDistance(midpoint,butterfly.centerParticle);
      if(d < 200){
        butterfly.centerParticle.set(midpoint.x, midpoint.y);
      }
      
      for (let star of stars) {
          let d = dist(midpoint.x, midpoint.y, star.centerPoint.x, star.centerPoint.y);
          if (d < particleGrabRadius) {
            draggedParticle = star.centerPoint;
            draggedParticle.set(midpoint.x, midpoint.y,);
          }
      }
    }
    else {
      draggedParticle = null;
      attraction.setStrength(0); 
    }
  } else {
    attraction.setStrength(0);
  }
}

function removeHandParticles() {
  for (let i = 0; i < handParticles.length; i++) {
    if (handAttractions[i]) {
      tailPhysics.removeBehavior(handAttractions[i]);
    }
  }
  handParticles = [];
  handAttractions = [];
}

function drawHand() {
  if (detections != undefined) {
    if (detections.multiHandLandmarks != undefined) {
      drawLines([0, 5, 9, 13, 17, 0]);//palm
      drawLines([0, 1, 2, 3, 4]);//thumb
      drawLines([5, 6, 7, 8]);//index finger
      drawLines([9, 10, 11, 12]);//middle finger
      drawLines([13, 14, 15, 16]);//ring finger
      drawLines([17, 18, 19, 20]);//pinky

      drawLandmarks([0, 1], 0);//palm
      drawLandmarks([1, 5], 60);//thumb
      drawLandmarks([5, 9], 120);//index finger
      drawLandmarks([9, 13], 180);//middle finger
      drawLandmarks([13, 17], 240);//ring finger
      drawLandmarks([17, 21], 300);//pinky

    }
  }
}

function keyPressed() {
  if (keyCode === 32) {
    location.reload();
  }
}