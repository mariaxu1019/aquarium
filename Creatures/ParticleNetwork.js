
class ParticleNetwork {
    constructor(physics, startPosition, stepDirection, numParticles, strength, damping) {
      this.particles = [];
      this.springs = [];
      this.physics = physics;
  
      for (let i = 0; i < numParticles; i++) {
        const particle = new VerletParticle2D(startPosition.add(stepDirection.scale(i)));
        this.physics.addParticle(particle);
        this.particles.push(particle);
        if(i % 2 ==0){
          this.particles[i].lock();
        }
        
  
        if (i > 0) {
          const prevParticle = this.particles[i - 1];
          const spring = new VerletSpring2D(prevParticle, particle, stepDirection.magnitude(), strength);
          spring.damping = damping;
          this.physics.addSpring(spring);
          this.springs.push(spring);
        }
  
        for (let j = 0; j < 2; j++) {
          const branchDirection = stepDirection.rotate(Math.PI / 2).scale((j + 1) * 10);
          const branchParticle = new VerletParticle2D(particle.add(branchDirection));
          this.physics.addParticle(branchParticle);
          const branchSpring = new VerletSpring2D(particle, branchParticle, random(5,branchDirection.magnitude()/5), strength);
          branchSpring.damping = damping;
          this.physics.addSpring(branchSpring);
          this.springs.push(branchSpring);
        }
      }
    }
  
    display() {
      stroke(255, 100);
      noFill();
      let fluctuatingRadius = 12 + 8 * sin(frameCount/40);
      for (const spring of this.springs) {
        if (spring.b !== this.particles[this.particles.indexOf(spring.a) + 1]) {
          fill(255,50);
          ellipse(spring.b.x, spring.b.y, fluctuatingRadius);
        }
      }
    }
  }


let particleNetworks = [];

function createParticleNetrwork(){

  const num = 7;
  const spacing = width/num;

  for(let i = 0; i < num; i++){
    const startPosition = new Vec2D(spacing * i,0);
    const stepDirection = new Vec2D(1, 0).normalizeTo(26);
    const numParticles = 12;
    const strength = 0.01;
    const damping = 0;

  particleNetworks.push(new ParticleNetwork(tailPhysics, startPosition, stepDirection, numParticles, strength, damping));
  }
  
}

function drawParticleNetwork(){
  for(let particleNetwork of particleNetworks){
    particleNetwork.display();
  }
}
