class Branch {
  constructor(begin, end, level, totalLevels, physics) {
    this.level = level;
    this.begin = begin;
    this.totalLevels = totalLevels;
    this.end = end;
    this.physics = physics;
    let d = dist(this.end.x, this.end.y, this.begin.x, this.begin.y);

    let repulsion = new AttractionBehavior(this.end, d, -0.7);
    this.physics.addBehavior(repulsion);

    let spring = new VerletSpring2D(this.begin, this.end, d, 0.1);
    this.physics.addSpring(spring);
    this.finished = false;

  }

  show() {
    stroke(255,200);
    let sw = map(this.level, this.totalLevels, 0, 5, 1);
    strokeWeight(1);
    circle(this.end.x, this.end.y, sw * 5);
  }

  branchA() {
    let dir = this.end.sub(this.begin);
    dir.rotate(PI / random(1, 6));
    dir.scaleSelf(0.67);
    let newEnd = new VerletParticle2D(this.end.add(dir));
    this.physics.addParticle(newEnd);
    let b = new Branch(this.end, newEnd, this.level + 1, this.totalLevels, this.physics);
    return b;
  }

  branchB() {
    let dir = this.end.sub(this.begin);
    dir.rotate(-PI / random(1, 4));
    dir.scaleSelf(0.67);
    let newEnd = new VerletParticle2D(this.end.add(dir));
    this.physics.addParticle(newEnd);
    let b = new Branch(this.end, newEnd, this.level + 1, this.totalLevels, this.physics);
    return b;
  }
}

class Tree {
  constructor(startX, startY, branchLength, branchCount, physics, levels) {
    this.tree = [];
    this.physics = physics;
    this.branchLength = branchLength;
    this.levels = levels;
    this.branchCount = branchCount;
    let a = new VerletParticle2D(startX, startY);
    a.lock();
    this.physics.addParticle(a);
    this.generateTree(a, this.branchLength, this.branchCount, this.levels);
  }

  generateTree(rootParticle, branchLength, branchCount, levels) {
    let angleStep = TWO_PI / this.branchCount;

    for (let i = 0; i < this.branchCount; i++) {
      let angle = angleStep * i;
      let b = new VerletParticle2D(rootParticle.x + cos(angle) * branchLength, rootParticle.y + sin(angle) * branchLength);
      this.physics.addParticle(b);
      b.lock();

      let rootBranch = new Branch(rootParticle, b, 0, this.levels, this.physics);
      this.tree.push(rootBranch);
    }

    for (let n = 0; n < levels; n++) {
      for (let i = this.tree.length - 1; i >= 0; i--) {
        if (!this.tree[i].finished) {
          let a = this.tree[i].branchA();
          let b = this.tree[i].branchB();
          this.tree.push(a);
          this.tree.push(b);
        }
        this.tree[i].finished = true;
      }
    }
  }

  show() {
    for (let i = this.tree.length - 1; i >= 0; i--) {
      this.tree[i].show();
    }
  }

}

let trees = [];
function createTreeCell() {

  const treeCount = 7; 
    const spacing = width / treeCount; 

    for (let i = 0; i < treeCount; i++) {
        let x = spacing * i + spacing / 2; 
        let y = height  
        let totalLevels = 3;
        let branchCount = 2;
        let tree = new Tree(x, y, random(70, 130), branchCount, physics, totalLevels);
        trees.push(tree);
    }
}

function drawTreeCell() {
    for (let tree of trees) {
        tree.show();
    }

} 
