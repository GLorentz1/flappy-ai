var bird;
var gravity = 0.15;
var gapSizeMin = 100;
var gapSizeMax = 150;
var gapYMin = 100;
var dead = false;
var pipes = [];

function preload()
{
  birdUpImg = loadImage('media/bird/bird-upflap.png');
  birdMidImg = loadImage('media/bird/bird-midflap.png');
  birdDownImg = loadImage('media/bird/bird-down.png');

  bgImg = loadImage('media/background/bg.png');

  pipeTopImg = loadImage('media/pipe/pipe-green-top.png');
  pipeBottomImg = loadImage('media/pipe/pipe-green-bottom.png');
}

function setup() {
  createCanvas(800, 600);
  bird = new Bird(100, height/2 - 100, 27, birdUpImg, birdMidImg, birdDownImg); 
  // pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin))); 
}

function draw() {
  image(bgImg, 0, 0);
  bird.show();


  if(frameCount % 100 == 0)
  {
    pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin), pipeTopImg, pipeBottomImg));
  }

  for (i = pipes.length - 1; i >= 0; i--)
  {
    pipes[i].build();
    pipes[i].move();
    if (pipes[i].score(bird))
    {
      bird.increaseScore();
    }
    
    bird.collide(pipes[i]);

    if(pipes[i].outOfScreen())
    {
      pipes.splice(i, 1);
    }
  }
  
  fill(0);
  textSize(24);
  fill(255);
  stroke(0);
  strokeWeight(3);
  text("SCORE: " + bird.score, 5 , height - 10);
  strokeWeight(1);

  if (bird.dead)
  {
    bird.reborn();
    pipes = [];

  }
  else
  {
    bird.move(gravity);
  }
}

function keyPressed()
{
  if (key == ' ')
  {
    bird.fly();
  }
}
