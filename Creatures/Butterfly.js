class Butterfly {
    constructor(physics, x, y, size) {
      this.triangles = [];
      this.springLength = size;
      this.particles = [];
      this.pendantLength = size * 0.4;
      this.pendants = [];
      this.physics = physics;
      this.centerParticle = new toxi.physics2d.VerletParticle2D(x, y);
      this.physics.addParticle(this.centerParticle);
  
      for (let i = 0; i < 2; i++) {
        let p1 = new toxi.physics2d.VerletParticle2D(
          this.centerParticle.x + this.springLength * cos(i * PI),
          this.centerParticle.y + this.springLength * sin(i * PI)
        );
        let p2 = new toxi.physics2d.VerletParticle2D(
          this.centerParticle.x + this.springLength * cos(i * PI + PI / 2),
          this.centerParticle.y + this.springLength * sin(i * PI + PI / 2)
        );
  
        this.physics.addParticle(p1);
        this.physics.addParticle(p2);
  
        let s1 = new toxi.physics2d.VerletSpring2D(
          this.centerParticle,
          p1,
          this.springLength,
          0.01
        );
        let s2 = new toxi.physics2d.VerletSpring2D(
          this.centerParticle,
          p2,
          this.springLength,
          0.01
        );
        let s3 = new toxi.physics2d.VerletSpring2D(p1, p2, this.springLength, 0.01);
  
        this.physics.addSpring(s1);
        this.physics.addSpring(s2);
        this.physics.addSpring(s3);
  
        this.triangles.push([this.centerParticle, p1, p2]);
        this.particles.push(p1, p2);
      }

      let interTriangleSpring = new toxi.physics2d.VerletSpring2D(
        this.particles[0],
        this.particles[2],
        this.springLength * 2,
        0.005
      );
      let interTriangleSpring2 = new toxi.physics2d.VerletSpring2D(
        this.particles[1],
        this.particles[3],
        this.springLength * 2,
        0.005
      );
      this.physics.addSpring(interTriangleSpring);
      this.physics.addSpring(interTriangleSpring2);

      for (let i = 0; i < this.particles.length; i++) {
        let angleOffset = i % 2 == 0 ? 0.1 : -0.1;
        let pendant = new toxi.physics2d.VerletParticle2D(
          this.particles[i].x + this.pendantLength * cos((TWO_PI / 4) * i + angleOffset),
          this.particles[i].y + this.pendantLength * sin((TWO_PI / 4) * i + angleOffset)
        );
  
        this.physics.addParticle(pendant);
        let spring = new toxi.physics2d.VerletSpring2D(
          this.particles[i],
          pendant,
          this.pendantLength,
          0.01
        );
        this.physics.addSpring(spring);
  
        this.pendants.push(pendant);
      }
    }
  
    display() {
      stroke(255, 100); 
      line(this.particles[0].x, this.particles[0].y, this.particles[2].x, this.particles[2].y);
      line(this.particles[1].x, this.particles[1].y, this.particles[3].x, this.particles[3].y);

      stroke(255);
      fill(255, 100);
      for (let tri of this.triangles) {
        beginShape();
        for (let p of tri) {
          vertex(p.x, p.y);
        }
        endShape(CLOSE);
      }
  
      for (let i = 0; i < this.pendants.length; i++) {
        ellipse(this.pendants[i].x, this.pendants[i].y, 7, 7); 
      }
      for (let p of this.particles) {
        circle(p.x, p.y, 20);
      }
    }
  }

  let butterfly;
   function createButterfly(){
      butterfly = new Butterfly(tailPhysics,width/2,height/2,35);
   }

   function drawButterfly(){
      butterfly.display();
   }