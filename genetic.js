var chance = 0.05;
function nextGeneration() {
    calcFitness();
    generation += 1;
    for (let i = 0; i < POPSIZE; i++) {
        let x = random(1);
        if (x < chance)
        {
            birds[i] = new Bird(100, height / 2 - 100, 27, birdUpImg, birdMidImg, birdDownImg);
        }
        else{
            birds[i] = new Bird(100, height / 2 - 100, 27, birdUpImg, birdMidImg, birdDownImg, pickOne().brain);
            birds[i].mutate();
        }
        
    }
}

function pickOne() {
    var index = -1;
    var r = random(1);
    while (r > 0) {
        index++;
        r = r - savedBirds[index].fitness;
    }

    return savedBirds[index];
}

function calcFitness() {
    let sum = 0;
    for (let bird of savedBirds) {
        sum += bird.score;
    }

    for (let bird of savedBirds) {
        bird.fitness = bird.score / sum;
    }

}