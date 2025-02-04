class Pipes
{
    constructor(gapHeight, gapY, topImg, botImg, vertSpd, spd = -1.75, gapX = width, w = 30, scrd = false)
    {
        this.w = w;
        this.gapHeight = gapHeight;
        this.gapX = gapX;
        this.gapY = gapY;
        this.x = width;
        this.speed = spd;
        this.vertSpeed = vertSpd;
        this.scored = scrd;
        this.topPipeImg = topImg;
        this.botPipeImg = botImg;
    }

    build()
    {
        var dTop = dist(this.x, 0, this.gapX, this.gapY);
        var dBottom = dist(this.x, height, this.gapX, dTop + this.gapHeight);

        //draw top pipe
        image(this.topPipeImg, this.x, 0, this.w, dTop);

        // //draw bottom pipe
        image(this.botPipeImg, this.x, dTop + this.gapHeight, this.w, dBottom);
    }

    move()
    {
        this.x += this.speed;
        this.gapX += this.speed;

        this.gapY += this.vertSpeed;

        if (this.gapY > height - this.gapHeight * 2) 
        {
            this.vertSpeed *= -1;
            this.gapY = height - this.gapHeight * 2;
        }
        if (this.gapY < this.gapHeight)
        {
            this.vertSpeed *= -1;
            this.gapY = this.gapHeight;
        }
    }

    outOfScreen()
    {
        return this.x <= - this.w;
    }

    score(bird)
    {
        if (this.x + this.w < bird.x - bird.r/2 && !this.scored)
        {
            this.scored = true;
            return true;
        }
    }
}