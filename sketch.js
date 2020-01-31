var bird;
var gravity = 0.15;
var gapSizeMin = 100;
var gapSizeMax = 150;
var gapYMin = 100;
var dead = false;
var pipes = [];

// function preload()
// {
//   // birdUpImg = loadImage('media/bird/bird-upflap.png');
//   birdMidImg = image('media/bird/bird-midlap.png');
//   // birdDownImg = loadImage('media/bird/bird-downflap.png');

//   // bgImg = loadImage('media/background/bg.png');

//   // pipeTopImg = loadImage('media/pipe/pipe-green-top.png');
//   // pipeBottomImg = loadImage('media/pipe/pipe-green-bottom.png');
// }

function setup() {
  createCanvas(800, 600);
  bird = new Bird(100, height/2 - 100, 25); 
  // pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin))); 
}

function draw() {
  background(220);
  bird.show();

  if(frameCount % 100 == 0)
  {
    pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin)));
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
