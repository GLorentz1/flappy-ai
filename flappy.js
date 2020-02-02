var birds = [];
var savedBirds = [];
var gravity = 0.15;
var gapSizeMin = 150;
var gapSizeMax = 200;
var gapYMin = 150;
var dead = false;
var frameFreq = 100;
var pipes = [];
var verticalSpeed;
const POPSIZE = 500;
const numReps = 100;
var counter = 0;
let slider;
var generation = 1;
var score = 0;
var maxscore = 0;
var bestBird;
var training = true;
var brainJSON;
function preload() {
  birdUpImg = loadImage('media/bird/bird-upflap.png');
  birdMidImg = loadImage('media/bird/bird-midflap.png');
  birdDownImg = loadImage('media/bird/bird-down.png');

  bgImg = loadImage('media/background/bg.png');

  pipeTopImg = loadImage('media/pipe/pipe-green-top.png');
  pipeBottomImg = loadImage('media/pipe/pipe-green-bottom.png');

  brainJSON = loadJSON("bird.json");
}

function setup() {
  createCanvas(800, 600);
  verticalSpeed = random(-2, 2);
  console.log(verticalSpeed);
  pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin), pipeTopImg, pipeBottomImg, verticalSpeed));
  slider = createSlider(1, 100, 5);
  if (training) {
    for (let i = 0; i < POPSIZE; i++) {
      birds[i] = new Bird(100, height / 2 - 100, 27, birdUpImg, birdMidImg, birdDownImg);
    }
  }

  // pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin))); 
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    counter += 1;

    if (counter % frameFreq == 0) {
      pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin), pipeTopImg, pipeBottomImg, verticalSpeed));
    }

    for (i = pipes.length - 1; i >= 0; i--) {
      pipes[i].move();

      if (training) {
        for (let j = birds.length - 1; j >= 0; j--) {
          if (pipes[i].score(birds[j])) {
            birds[j].increaseScore(100);
          }

          birds[j].collide(pipes[i]);
          var closest = birds[j].closestPipe(pipes);
          // var distToGap = abs(birds[j].y - (closest.gapY + closest.gapHeight / 2));
          if (birds[j].y - birds[j].r/2 > closest.gapY + birds[j].r/2 && birds[j].y + birds[j].r/2 < closest.gapY + closest.gapHeight - birds[j].r/2)
          {
            birds[j].score += 2;
          }

          birds[j].score += 1;

          if (!birds[j].dead) {
            birds[j].move(gravity, pipes);
          }
          else {
            savedBirds.push(birds.splice(j, 1)[0]);
          }
        }
      }
      else {
        if (pipes[i].score(bestBird)) {
          bestBird.increaseScore(1);
        }

        bestBird.collide(pipes[i]);
      }

      if (pipes[i].outOfScreen()) {
        pipes.splice(i, 1);
        score += 1;
      }
    }

    if (training) {
      if (birds.length == 0) {

        if (score > maxscore) {

          maxscore = score;
          bestBird = savedBirds.splice(savedBirds.length - 1, 1)[0];
        }
        console.log("SCORE - " + score);
        nextGeneration();
        score = 0;
        pipes = [];
        counter = 0;
        savedBirds = [];
        pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin), pipeTopImg, pipeBottomImg, verticalSpeed));

      }
    }
    else {
      if (!bestBird.dead) {
        bestBird.move(gravity, pipes);
      }
      else {
        bestBird.reborn();
        counter = 0;
        pipes.push(new Pipes(random(gapSizeMin, gapSizeMax), random(gapYMin, height - gapYMin), pipeTopImg, pipeBottomImg, verticalSpeed));

      }
    }


  }

  image(bgImg, 0, 0);
  for (let pipe of pipes) {
    pipe.build();

  }
  if (training) {
    textSize(24);
    fill(255);
    stroke(0);
    strokeWeight(3);
    text("GENERATION - " + generation, 5, height - 85);
    text("BIRDS ALIVE - " + birds.length, 5, height - 120);
    for (let bird of birds) {
      bird.show();
    }
  }
  else {
    bestBird.show();
  }




  text("CURRENT SCORE - " + score, 5, height - 15);
  text("MAX SCORE - " + maxscore, 5, height - 50);


  strokeWeight(1);




}

function keyPressed() {
  if (key === 'S' || key === 's') {
    save(bestBird.brain.serialize(), "bird" + maxscore + ".json");
  }
  if (key === "L" || key === "l") {
    training = false;
    let bestBrain = NeuralNetwork.deserialize(brainJSON);
    bestBird = new Bird(100, height / 2 - 100, 27, birdUpImg, birdMidImg, birdDownImg, bestBrain);
  }
  if (key === 'T' || key === 't') {
    training = true;
  }
}
