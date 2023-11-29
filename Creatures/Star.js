class Star {
  constructor(centerX, centerY, points, radius1, radius2) {
    this.points = [];
    this.radius1 = radius1;
    this.radius2 = radius2;
    this.centerX = centerX;
    this.centerY = centerY;
    this.particleStrings = [];

    this.centerPoint = new VerletParticle2D(centerX, centerY);
    physics.addParticle(this.centerPoint);
    this.generatePoints(centerX, centerY, points, radius1, radius2);
  }

  generatePoints(centerX, centerY, points, radius1, radius2) {
    let angle = TWO_PI / points;
    let lastInnerPoint = null; 
    let firstInnerPoint = null; 
    let innerDistance = 0;
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = centerX + cos(a) * radius2;
      let sy = centerY + sin(a) * radius2;
      this.points.push(new VerletParticle2D(sx, sy));
      physics.addParticle(this.points[this.points.length - 1]);
      if (a < TWO_PI) {
        let sx = centerX + cos(a + angle / 2) * radius1;
        let sy = centerY + sin(a + angle / 2) * radius1;
        let innerPoint = new VerletParticle2D(sx, sy);
        this.points.push(innerPoint);
        physics.addParticle(this.points[this.points.length - 1]);
        const stepDirection = new toxi.geom.Vec2D(0, 1).normalizeTo(15);
        let numParticles = random(4, 20);
        let strength = 0.01;
        let damping = 0;
        let particleString = new ParticleString(tailPhysics, innerPoint, stepDirection, numParticles, strength, damping);
        this.particleStrings.push(particleString); 
        let innerSpring = new VerletSpring2D(innerPoint, this.centerPoint, this.centerPoint.distanceTo(innerPoint), 0.01);
        physics.addSpring(innerSpring);

        if (lastInnerPoint != null) {
          innerDistance = innerPoint.distanceTo(lastInnerPoint);
          let innerInnerSpring = new VerletSpring2D(innerPoint, lastInnerPoint, innerDistance, 0.01);
          physics.addSpring(innerInnerSpring);
        } else {
          firstInnerPoint = innerPoint; 
        }
        lastInnerPoint = innerPoint; 
      }
    }
    let innerInnerSpring = new VerletSpring2D(lastInnerPoint, firstInnerPoint, innerDistance, 0.01);
    physics.addSpring(innerInnerSpring);

    for (let i = 0; i < this.points.length - 1; i++) {
      let spring = new VerletSpring2D(this.points[i], this.points[i + 1], this.points[i].distanceTo(this.points[i + 1]), 0.01);
      physics.addSpring(spring);
    }

    let extraSpring = new VerletSpring2D(this.points[this.points.length - 1], this.points[0], this.points[this.points.length - 1].distanceTo(this.points[0]), 0.01);
    physics.addSpring(extraSpring);

    for (let i = 0; i < points - 1; i++) {
      for (let offset = 2; offset <= points / 2; offset++) {
        const j = (i + offset) % points;

        if (this.points[2 * i] && this.points[2 * j]) {
          const distance = this.points[2 * i].distanceTo(this.points[2 * j]);
          const spring = new VerletSpring2D(this.points[2 * i], this.points[2 * j], distance, 0.1);
          physics.addSpring(spring);
        }
      }
    }

  }

  updateParticleStrings() {
    for (let i = 0; i < this.particleStrings.length; i++) {
      this.particleStrings[i].particles[0].set(this.points[i * 2 + 1]);
    }
  }

  draw() {
    strokeWeight(1);
    stroke(255, 30); 
    for (let i = 0; i < physics.springs.length; i++) {
      let spring = physics.springs[i];
      line(spring.a.x, spring.a.y, spring.b.x, spring.b.y);
    }

    fill(255, 100);
    stroke(255);
    beginShape();
    for (let p of this.points) {
      circle(p.x, p.y, 10);
      vertex(p.x, p.y);
    }
    endShape(CLOSE);

    this.updateParticleStrings();
    for (let particleString of this.particleStrings) {
      particleString.display();
    }
  }
}

let stars = [];

function createStars() {
  let angStars = [];
  let numStars = 7;
  for (let i = 0; i < numStars; i++) {
    let centerX = random(width / 6, width - width / 6);
    let centerY = random(height / 6, height - height / 6);
    angStars.push(floor(random(3, 8)));
    let innerRadius = random(7, 15)*1.5;
    let outerRadius = innerRadius + random(10, 30);
    let star = new Star(centerX, centerY, angStars[i], innerRadius, outerRadius);
    stars.push(star);
  }
}

function drawStars() {
  for (let star of stars) {
    star.draw();
  }
  for (let s of tailPhysics.springs) {
    line(s.a.x, s.a.y, s.b.x, s.b.y);
  }
}