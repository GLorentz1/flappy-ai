class Pipes
{
    constructor(gapHeight, gapY, gapX = width, w = 30, spd = -1.75, scrd = false)
    {
        this.w = w;
        this.gapHeight = gapHeight;
        this.gapX = gapX;
        this.gapY = gapY;
        this.x = width;
        this.speed = spd;
        this.scored = scrd;
        // this.topPipeImg = topImg;
        // this.botPipeImg = botImg;
    }

    build()
    {
        var dTop = dist(this.x, 0, this.gapX, this.gapY);
        var dBottom = dist(this.x, height, this.gapX, dTop + this.gapHeight);

        //draw top pipe
        fill(0, 255, 125);
        rect(this.x, 0, this.w, dTop);

        //draw bottom pipe
        rect(this.x, dTop + this.gapHeight, this.w, dBottom);
    }

    move()
    {
        this.x += this.speed;
        this.gapX += this.speed;
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