class Bird {

  constructor(birdX, birdY, birdRadius, jmp = -3, birdSpeed = 0, scr = 0) {
    this.x = birdX;
    this.y = birdY;
    this.r = birdRadius;
    this.jump = jmp;
    this.speed = birdSpeed;
    this.score = scr;
    this.dead = false;
  }

  show() {
    // image(this.currentImg, this.x, this.y, this.r, this.r);
    noFill();
    circle(this.x, this.y, this.r);
  }

  fly() {
    if (this.speed > 0){
      this.speed = 0;
    }

    this.speed += this.jump;
    if (this.speed < 2 * this.jump)
    {
      this.speed = 2 * this.jump;
    }
    this.y += this.speed;
  }

  reborn()
  {
    console.log(this.score);
    this.y = height / 2 - 100;
    this.speed = 0;
    this.score = 0;
    this.dead = false;

  }

  move(gravity) {
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

    this.dead = this.y >= height;

  }

  collide(pipe)
  {
    var xRightBoundary = this.x + this.r/2;
    var xLeftBoundary = this.x - this.r/2;
    var yTopBoundary = this.y - this.r/2;
    var yBottomBoundary = this.y + this.r/2;
    var pipeXLeft = pipe.x;
    var pipeXRight = pipe.x + pipe.w;
    var pipeYTop = dist(pipeXLeft, 0, pipe.gapX, pipe.gapY);
    var pipeYBottom = height - dist(pipeXLeft, height, pipe.gapX, pipeYTop + pipe.gapHeight);

    // check against left-wall-top-pipe

    if(xRightBoundary >= pipeXLeft && xRightBoundary <= pipeXRight)
    {
      if(yTopBoundary <= pipeYTop)
      {
        this.dead = true;
      }

      if(yBottomBoundary >= pipeYBottom)
      {
        this.dead = true;
      }
    }

    if (xLeftBoundary <= pipeXRight && xLeftBoundary >= pipeXLeft)
    {
      if(yBottomBoundary >= pipeYBottom)
      {
        this.dead = true;
      }

      if(yTopBoundary <= pipeYTop)
      {
        this.dead = true;
      }

    }
  }

  increaseScore()
  {
    this.score += 1;
  }
}