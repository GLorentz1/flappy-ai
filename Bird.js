

function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian(0, 0.1);
    var newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Bird {

  constructor(birdX, birdY, birdRadius, birdUp, birdMid, birdDown, brain, jmp = -2.5, birdSpeed = 0, scr = 0, imgSize = 25, rot = 0, lvl = 0) {
    this.x = birdX;
    this.y = birdY;
    this.r = birdRadius;
    this.imgSize = imgSize;
    this.jump = jmp;
    this.speed = birdSpeed;
    this.score = scr;
    this.dead = false;
    this.currentImg = birdMid;
    this.upImg = birdUp;
    this.midImg = birdMid;
    this.downImg = birdDown;
    this.rotation = rot;
    this.level = lvl;
    this.fitness = 0;

    if (brain) {
      this.brain = brain.copy();
    }
    else {
      this.brain = new NeuralNetwork(6, 5, 1);
    }

  }

  mutate() {
    this.brain.mutate(mutate);
  }

  show() {
    this.rotation = map(this.speed, -6, 6, - PI / 180 * 45, PI / 180 * 45);

    translate(this.x, this.y);
    rotate(this.rotation);
    imageMode(CENTER);

    image(this.currentImg, 0, 0, this.imgSize, this.imgSize);

    imageMode(CORNER);
    rotate(- this.rotation);
    translate(-this.x, -this.y);
  }

  fly() {
    if (this.speed > 0) {
      this.speed = 0;
    }

    this.speed += this.jump;
    if (this.speed < 2 * this.jump) {
      this.speed = 2 * this.jump;
    }
    this.y += this.speed;
    this.currentImg = this.upImg;
  }

  reborn() {
    var finalScore = this.score;
    this.y = height / 2 - 100;
    this.speed = 0;
    this.score = 0;
    this.dead = false;

    // should it reset when the player dies? 
    this.level = 0;

    return finalScore;

  }

  closestPipe(pipes) {
    let closest = null;
    let closestDist = Infinity;

    for (let pipe of pipes) {
      if (pipe.x + pipe.w - this.x - this.r / 2 < closestDist && pipe.x + pipe.w - this.x - this.r / 2 > 0) {
        closestDist = pipe.x - this.x;
        closest = pipe;
      }
    }
    return closest;
  }
  think(pipes) {
    var closest = this.closestPipe(pipes);

    let inputs = [];
    //console.log(((1 / ((closest.x - this.x )/ width)) / 30) * (((closest.gapY + closest.gapHeight/2) - this.y ) / height))
    inputs[0] = ((1 / ((closest.x - this.x )/ width)) / 30) * (((closest.gapY + closest.gapHeight/2) - this.y ) / height) ;
    inputs[1] = (closest.gapY + closest.gapHeight) / height;
    inputs[2] = this.speed / 20;
    inputs[3] = closest.gapY / height;
    //inputs[4] = ((closest.gapY + closest.gapHeight/2) - this.y ) / height;
    inputs[4] = this.y / height;
    inputs[5] = closest.vertSpeed / 2;

    // if(this.y > closest.gapY + closest.gapHeight/1.5)
    // {
    //   inputs[3] = 1;
    // }
    // else
    // {
    //   inputs[3] = 0;
    // }

    //gapY represents the top Y of the gap
    //gapY + gapHeight = bottom Y of the gap
    //console.log(closest.verticalSpeed);
    //inputs[6] = closest.vertSpeed / 2;
    let outputs = this.brain.predict(inputs);
    let decision = outputs[0];

    // console.log(decision);
    if (decision > 0.5) {
      this.fly();
    }
  }

  move(gravity, pipes) {
    this.think(pipes);
    this.increaseScore(0.01);

    this.speed += gravity;
    this.y += this.speed;

    if (this.y <= 0) {
      this.y = 0;
      this.speed = 0;
    }

    if (this.y >= height) {
      this.y = height;
      this.speed = 0;
    }

    if (this.speed > 0) {
      this.currentImg = this.downImg;
    }
    this.dead = this.y >= height;

  }

  collide(pipe) {
    var xRightBoundary = this.x + this.r / 2;
    var xLeftBoundary = this.x - this.r / 2;
    var yTopBoundary = this.y - this.r / 2;
    var yBottomBoundary = this.y + this.r / 2;
    var pipeXLeft = pipe.x;
    var pipeXRight = pipe.x + pipe.w;
    var pipeYTop = dist(pipeXLeft, 0, pipe.gapX, pipe.gapY);
    var pipeYBottom = height - dist(pipeXLeft, height, pipe.gapX, pipeYTop + pipe.gapHeight);

    // check against left-wall-top-pipe

    if (xRightBoundary >= pipeXLeft && xRightBoundary <= pipeXRight) {
      if (yTopBoundary <= pipeYTop) {
        this.dead = true;
      }

      if (yBottomBoundary >= pipeYBottom) {
        this.dead = true;
      }
    }

    if (xLeftBoundary <= pipeXRight && xLeftBoundary >= pipeXLeft) {
      if (yBottomBoundary >= pipeYBottom) {
        this.dead = true;
      }

      if (yTopBoundary <= pipeYTop) {
        this.dead = true;
      }

    }
  }

  increaseScore(amount) {
    this.score += amount;
  }
}