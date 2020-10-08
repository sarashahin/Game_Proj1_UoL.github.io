/*
---------------------------------
Extension 1 ---- Add sound ------
 I added sounds to for the panda jumping, falling,
 losing a life, completing the level and also added
 an ambient background music.
 Sound files sourced from https://freesound.org/
 Adding sound was easy, however I had to add some 
 Boolean logic to make sure the sounds stopped and played
 at the right time without overlapping.
_________________________________
---------------------------------
Extension 2 ---- Create enemies  ---- 
I used the constructor function to create some owls as enemies
In my constructor function i used a scale parameter and rgb values
to draw different sized owls with different colours to add some 
variety to my enemies and make the game more varied.
_________________________________

---- Additional Extensions ------
---------------------------------
Extension 3 ---- Create Particel rain EffectSystem
I used constructor functions to create a particle Emmiter and Particle objects  
I learnt about prototypal inheritance. I used this technique to add functions
to my Particles as this is a more efficient use of memory usage, 
https://javascript.info/prototype-inheritance

prototype inheritance allows me to add new properties to 
my objects. I only use prototypal inheritance for my particle
objects because I was instantiating a few hundred particles.
I only instantiated a handful of other objects, like collectibles, 
canyons, enemies etc and did not think prototypal inheritance made
much difference in performance. 
 --------------------------------
*/

// Global variables

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var collectables;
var canyons;
var game_score;

var flagpole;
var lives;

var platforms;
var enemies;

var jumpSound;
var deathSound;
var collectSound ;
var levelCompleteSound;
var isLevelCompleteSoundPlaying;
var gameOverSound;
var isGameOverSoundPlaying;
var themeSound;
var backgroundSound;

// Particle rainEffectSystem
var rainEffectSystem;

function preload()
{
    soundFormats('mp3', 'wav');
    // background music
    backgroundSound = loadSound('assets/sound/backgroundMusic.mp3');
    // load your sounds here
    jumpSound = loadSound('assets/sound/jump.wav');    
    deathSound = loadSound('assets/sound/deathSound.mp3');    
    gameOverSound = loadSound('assets/sound/gameOver.mp3');    
    collectSound = loadSound('assets/sound/collectGem.mp3');    
    levelCompleteSound = loadSound('assets/sound/levelComplete.mp3');    
}

function setup()
{
	createCanvas(1024, 576);
    lives = 3;
    game_score = 0;
    textSize(20);
    jumpSound.setVolume(0);
    deathSound.setVolume(0);
    gameOverSound.setVolume(0);
    collectSound.setVolume(0);
    levelCompleteSound.setVolume(0);
    rainEffectSystem = new ParticleEmmiter(createVector(width/2, -20));
    startGame(); 
}

//game start and reset
function startGame()
{
    floorPos_y = height * 3/4;
	gameChar_x = width/2;
    gameChar_y = floorPos_y;
    
	// Variable to control the background scrolling.
	scrollPos = 0;
    // Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
    isPlummeting = false;

    // Boolean variables to control sounds
    isGameOverSoundPlaying = false;
    isLevelCompleteSoundPlaying = false;

	// Initialise arrays of scenery objects.
    trees_x = [-1600,-800,-200,250,1200,1650,2100];
    
    clouds =[
        new Cloud(100, 10, 50),
        new Cloud(400, 20, 40),
        new Cloud(665, 65, 60),
        new Cloud(925, 185, 35),
        new Cloud(1100, 10, 50),
        new Cloud(1400, 250, 50)
    ];
    
    mountains = [
        new Mountain(400, floorPos_y, 320, 230),
        new Mountain(550, floorPos_y, 200, 130),
        new Mountain(750, floorPos_y, 320, 230),
        new Mountain(900, floorPos_y, 200, 130 ),
        new Mountain(2200, floorPos_y, 320, 230 ),
        new Mountain(400, floorPos_y, 320, 230 ),
        new Mountain(400, floorPos_y, 320, 230 )
    ];    

    collectables = [
        new Collectable(-1280, floorPos_y, 105, false),
        new Collectable(-780, floorPos_y, 75, false),
        new Collectable(190, floorPos_y, 85, false),
        new Collectable(650, floorPos_y-205, 95, false),
        new Collectable(850, floorPos_y, 75, false),
        new Collectable(1000, floorPos_y, 85, false),
        new Collectable(1280, floorPos_y, 95, false)
    ];
    
    canyons = [
        new Canyon(-1600, 400),
        new Canyon(20, 150),
        new Canyon(700, 100),
        new Canyon(1500, 100),
        new Canyon(1900, 100)
    ];

    platforms = [
        createPlatforms(-1050, floorPos_y - 100, 90),
        createPlatforms(-500, floorPos_y - 100, 100),
        createPlatforms(100, floorPos_y-100, 100),
        createPlatforms(500, floorPos_y-100, 200),
        createPlatforms(610, floorPos_y-200, 120),
        createPlatforms(1380, floorPos_y-100, 120),
        createPlatforms(1800, floorPos_y-100, 120)
    ];    

    flagpole = {isReached: false, x_pos: 2200};    
    player ={isDead: false};    
 
    // params: xposition, yposition, red, green, blue,  scale, range)         
    enemies = [
        new Enemy( -100, floorPos_y, 255, 204, 0, random(0.25, 0.75), 30),
        new Enemy( - 800, floorPos_y, 0, 204, 80, random(0.25, 0.75), 100),
        new Enemy(180, floorPos_y, 160, 82, 45, random(0.25, 0.75), 150),
        new Enemy(800, floorPos_y, 218, 165, 32, random(0.25, 0.75), 70),
        new Enemy(1400, floorPos_y, 100, 80, 180, random(0.25, 0.75), 120),
        new Enemy(1800, floorPos_y, 0, 204, 80, random(0.25, 0.75), 100),
        new Enemy(2000, floorPos_y, 255, 204, 0, random(0.25, 0.75), 300)
    ];
 }

function draw()
{
    // fill the sky blue
	background(224, 255, 255);
    noStroke();
    // draw some green ground
    fill(103, 204, 155);
	rect(0, floorPos_y, width, height/4);
    
    if(isPlummeting)
    {
        gameChar_y += 5;
    }

    push();
        translate(scrollPos,0);

        //render the game graphics
        drawMountains();
        drawTrees();
        drawClouds();
        drawPlatforms();
        drawCanyons();
        drawCollectables();
        drawEnemies();   

        // Draw flagpole
        renderFlagpole();
    
        // Call particel rainEffectSystem
        rainEffectSystem.addParticle();
        rainEffectSystem.run();
    pop();
    
    // Draw game character.
	drawGameChar();

    fill(255, 160, 0);
    noStroke();
    textSize(20);
    text('Score:' + game_score,20,40);    

    // count lives
    checkPlayerDie();
    drawLives();
    
    if(lives < 1)
    {
        gameOver();
    }
    if(flagpole.isReached == true)
    {
        var c = color(0, 60, 255, 100);
        fill(c);
        rect(0,0,width, height);
        fill(255,180,150);
        textSize(50);
        text("Level complete. Press space to continue.", 50,150);
    }

    // Logic to make the game character move or the background scroll.
	if(isLeft)
	{
        if(gameChar_x > width * 0.2)
		{
            gameChar_x -= 5;
        }
        else
		{
            scrollPos += 5;
		}
	}

	if(isRight)
	{
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 5;
		}
        else
        {
            scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character jump on platforms.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
                break;
            }
        }
        if(!isContact)
        {
            gameChar_y += 5;
            isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }    
    
    if(!player.isDead)
    {
        checkPlayerDie();
    } 
    
    // logic to make flagpole    
    if(flagpole.isReached == false)
    {
        checkFlagpole();    
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    backgroundSound.loop();
    backgroundSound.setVolume(0.05);

    //ArrowLeft 37 , ArrowRight 39, Space 32, w 87       
    if(key == 'A' || keyCode == 37){
        isLeft = true;
    }
    else if(key == 'D'|| keyCode == 39){
        isRight = true;   
    }
    if(keyCode == 32 || keyCode == 87){
        if(!isFalling)
        {
            gameChar_y -= 100;
            jumpSound.setVolume(0.1);
            jumpSound.play();
        }
    }
    
    if((flagpole.isReached && keyCode == 32) || lives < 1)
    {
        restartGame();
        return;
    } 
    
    if(flagpole.isReached && key == 32)
    {
        restartGame();
        return;
    }
}

function keyReleased()
{
    if(key == 'A' || keyCode == 37)
    {
        isLeft = false;
    }
    else if(key == 'D' || keyCode == 39)
    {
        isRight = false;   
    }    
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
   
function drawGameChar()
{
	// draw game character

     if(isLeft && isFalling)
    {
        // add your jumping-left code
        fill(255);
        stroke(0,0,0);
        ellipse(gameChar_x+3, gameChar_y -53,45,40);
        // Eyesleft
        fill(0,0,0);
        ellipse(gameChar_x-8,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x-8,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x-8,gameChar_y-60,2,2);
        // Eye right
        fill(0,0,0);
        ellipse(gameChar_x+ 12,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x+ 12,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x+ 12,gameChar_y-60,2,2);
        // Ear Left
        fill(0,0,0);
        ellipse(gameChar_x-19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x-19,gameChar_y - 70,6,5);
        // Ear Right
        fill(0,0,0);
        ellipse(gameChar_x +19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x+ 19,gameChar_y - 70,6,5);
        // Nose
        fill(0,0,0);
        ellipse(gameChar_x -2 , gameChar_y - 49,7,4);
        // Mouth
        fill(0,0,0);
        ellipse(gameChar_x, gameChar_y - 40,15,1);
        // Body
        fill(255);
        ellipse(gameChar_x +2, gameChar_y -20,32,29 );
        // legs Left
        fill(0,0,0);
        ellipse(gameChar_x-4, gameChar_y - 5,8,11);
        // legs right
        fill(0,0,0);
        ellipse(gameChar_x+4, gameChar_y - 5,8,11);
        // hands Left
        fill(0,0,0);
        ellipse(gameChar_x - 11, gameChar_y -30, 10, 18);
        // Right hand
        fill(0,0,0);
        ellipse(gameChar_x + 14, gameChar_y -30, 10, 18);
    }
     else if(isRight && isFalling)
     {
        // add your jumping-right code
        fill(255);
        stroke(0,0,0);
        ellipse(gameChar_x -3, gameChar_y -53,45,40);
        // Eyesleft
        fill(0,0,0);
        ellipse(gameChar_x-13,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x-12,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x-12,gameChar_y-60,2,2);
        // Eye right
        fill(0,0,0);
        ellipse(gameChar_x+ 7,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x+ 8,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x+ 8,gameChar_y-60,2,2);
        // Ear Left
        fill(0,0,0);
        ellipse(gameChar_x-19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x-19,gameChar_y - 70,6,5);
        // Ear Right
        fill(0,0,0);
        ellipse(gameChar_x +19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x+ 19,gameChar_y - 70,6,5);
        // Nose
        fill(0,0,0);
        ellipse(gameChar_x -1 , gameChar_y - 49,7,4);
        // Mouth
        fill(0,0,0);
        ellipse(gameChar_x, gameChar_y - 40,15,1);
        // Body
        fill(255);
        ellipse(gameChar_x -2, gameChar_y -20,32,29 );
        // legs Left
        fill(0,0,0);
        ellipse(gameChar_x-4, gameChar_y - 5,8,11);
        // legs right
        fill(0,0,0);
        ellipse(gameChar_x+4, gameChar_y - 5,8,11);
        // hands Left
        fill(0,0,0);
        ellipse(gameChar_x - 13, gameChar_y -30, 10, 18);
        // Right hand
        fill(0,0,0);
        ellipse(gameChar_x + 10, gameChar_y -30, 10, 18);

     }
     else if(isLeft)
     {
        // add your walking left code
        fill(255);
        stroke(0,0,0);
        ellipse(gameChar_x+3, gameChar_y -53,45,40);
        // Eyesleft
        fill(0,0,0);
        ellipse(gameChar_x-8,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x-8,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x-8,gameChar_y-60,2,2);
        // Eye right
        fill(0,0,0);
        ellipse(gameChar_x+ 12,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x+ 12,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x+ 12,gameChar_y-60,2,2);
        // Ear Left
        fill(0,0,0);
        ellipse(gameChar_x-19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x-19,gameChar_y - 70,6,5);
        // Ear Right
        fill(0,0,0);
        ellipse(gameChar_x +19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x+ 19,gameChar_y - 70,6,5);
        // Nose
        fill(0,0,0);
        ellipse(gameChar_x -2 , gameChar_y - 49,7,4);
        // Mouth
        fill(0,0,0);
        ellipse(gameChar_x, gameChar_y - 40,15,1);
        // Body
        fill(255);
        ellipse(gameChar_x +2, gameChar_y -20,32,29 );
        // legs Left
        fill(0,0,0);
        ellipse(gameChar_x-4, gameChar_y,8,11);
        // legs right
        fill(0,0,0);
        ellipse(gameChar_x+4, gameChar_y,8,11);
        // hands Left
        fill(0,0,0);
        ellipse(gameChar_x - 11, gameChar_y -20, 10, 18);
        // Right hand
        fill(0,0,0);
        ellipse(gameChar_x + 14, gameChar_y -20, 10, 18);
     }
     else if(isRight)
     {
        // add your walking right code
        fill(255);
        stroke(0,0,0);
        ellipse(gameChar_x -3, gameChar_y -53,45,40);
        // Left Eye
        fill(0,0,0);
        ellipse(gameChar_x-13,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x-12,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x-12,gameChar_y-60,2,2);
        // Right Eye 
        fill(0,0,0);
        ellipse(gameChar_x+ 7,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x+ 8,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x+ 8,gameChar_y-60,2,2);
        // Left Ear
        fill(0,0,0);
        ellipse(gameChar_x-19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x-19,gameChar_y - 70,6,5);
        // Right Ear
        fill(0,0,0);
        ellipse(gameChar_x +19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x+ 19,gameChar_y - 70,6,5);
        // Nose
        fill(0,0,0);
        ellipse(gameChar_x -1 , gameChar_y - 49,7,4);
        // Mouth
        fill(0,0,0);
        ellipse(gameChar_x, gameChar_y - 40,15,1);
        // Body
        fill(255);
        ellipse(gameChar_x -2, gameChar_y -20,32,29 );
        // Left Leg
        fill(0,0,0);
        ellipse(gameChar_x-4, gameChar_y,8,11);
        // Right Leg
         fill(0,0,0);
        ellipse(gameChar_x+4, gameChar_y,8,11);
        // Left Hand
        fill(0,0,0);
        ellipse(gameChar_x - 13, gameChar_y -20, 10, 18);
        // Right Hand
        fill(0,0,0);
        ellipse(gameChar_x + 10, gameChar_y -20, 10, 18);

     }
     else if(isFalling || isPlummeting)
     {
        // add your jumping facing forwards code
        fill(255);
        stroke(0,0,0);
        ellipse(gameChar_x, gameChar_y -53,45,40);
        // Eyesleft
        fill(0,0,0);
        ellipse(gameChar_x-10,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x-10,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x-10,gameChar_y-60,2,2);
        // Eye right
        fill(0,0,0);
        ellipse(gameChar_x+ 10,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x+ 10,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x+ 10,gameChar_y-60,2,2);
        //  Ear Left
        fill(0,0,0);
        ellipse(gameChar_x-19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x-19,gameChar_y - 70,6,5);
        //   Ear Right
        fill(0,0,0);
        ellipse(gameChar_x +19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x+ 19,gameChar_y - 70,6,5);
        // Nose
        fill(0,0,0);
        ellipse(gameChar_x , gameChar_y - 50,7,4);
        // Mouth
        fill(0,0,0);
        ellipse(gameChar_x, gameChar_y - 40,15,1);
        // Body
        fill(255);
        ellipse(gameChar_x, gameChar_y -20,32,29 );
        // Left leg   
        fill(0,0,0);
        ellipse(gameChar_x-5, gameChar_y-10,8,11);
        // right leg 
        fill(0,0,0);
        ellipse(gameChar_x+5, gameChar_y-10,8,11);
        // Left hand 
        fill(0,0,0);
        ellipse(gameChar_x - 14, gameChar_y -30, 10, 18);
        // Right hand
        fill(0,0,0);
        ellipse(gameChar_x + 14, gameChar_y -30, 10, 18);
     }
     else
     {
        // add your standing front facing code
        fill(255);
        stroke(0,0,0);
        ellipse(gameChar_x, gameChar_y -53,45,40);
        //   Eyesleft
        fill(0,0,0);
        ellipse(gameChar_x-10,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x-10,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x-10,gameChar_y-60,2,2);
        //   Eye right
        fill(0,0,0);
        ellipse(gameChar_x+ 10,gameChar_y-60,15,15);
        fill(255);
        ellipse(gameChar_x+ 10,gameChar_y-60,8,8);
        fill(0,0,0);
        ellipse(gameChar_x+ 10,gameChar_y-60,2,2);
        //  Ear Left
        fill(0,0,0);
        ellipse(gameChar_x-19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x-19,gameChar_y - 70,6,5);
        //   Ear Right
        fill(0,0,0);
        ellipse(gameChar_x +19,gameChar_y - 70,8,10);
        fill(128,128,128);
        ellipse(gameChar_x+ 19,gameChar_y - 70,6,5);
        //    Nose
        fill(0,0,0);
        ellipse(gameChar_x , gameChar_y - 50,7,4);
        //    Mouth
        fill(0,0,0);
        ellipse(gameChar_x, gameChar_y - 40,15,1);
        // Body
        fill(255);
        ellipse(gameChar_x, gameChar_y -20,32,29 );
        //Left leg
        fill(0,0,0);
        ellipse(gameChar_x-5, gameChar_y,8,11);
        //Right leg
        fill(0,0,0);
        ellipse(gameChar_x+5, gameChar_y,8,11);
        // Left hand
        fill(0,0,0);
        ellipse(gameChar_x - 14, gameChar_y -20, 10, 18);
        // Right hand
        fill(0,0,0);
        ellipse(gameChar_x + 14, gameChar_y -20, 10, 18);        
    }
}

// --------------------------------------------
// Background Game Graphics render functions
// --------------------------------------------

// render mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        mountains[i].draw();
    }
}

// render tree objects.
function drawTrees()
{
    var treeCanopyPos_y = floorPos_y - 220;
    var treeTrunkPos_y = floorPos_y -125; 
    for(var i = 0; i < trees_x.length; i++)
    {        
        // Trunk
        fill(47,29,21);
        ellipse(trees_x[i],treeTrunkPos_y, 60, 260);
        //  Canopy using Circle Objects
        //params used: radius, r, g, b, alpha, x, y
        c = new Circle(200, 247, 206, 143, 255, trees_x[i], treeCanopyPos_y );
        c.draw();
        c1 = new Circle(100, 153, 108, 162, 255, trees_x[i], treeCanopyPos_y );
        c1.draw();
        c2 = new Circle(50, 255, 128, 0, 250, trees_x[i], treeCanopyPos_y );
        c2.draw();
        c3 = new Circle(25, 204, 229, 155, 120, trees_x[i] + random(-5,5), treeCanopyPos_y + random(-5,5) );
        c3.draw();
    }
}

// render clouds
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    { 
        clouds[i].draw();
        clouds[i].move();
    }
}

// render canyons
function drawCanyons()
{
    for(var i = 0; i < canyons.length; i++)
    { 
        //drawCanyon(canyons[i]);
        canyons[i].draw();
        canyons[i].check();
    }
}

// render platforms
function drawPlatforms()
{
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
}

// render collectables
function drawCollectables()
{
    // Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
            collectables[i].draw();
            collectables[i].check();       
        }
    }
}

// render enemies
function drawEnemies(){
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();         
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);         
        if(isContact)
        {
            if(lives > 0)
            {
                startGame();
            }
        }
     }
}

// render the flagpole
function renderFlagpole()
{
    push();
        strokeWeight(5);
        stroke(180);
        line(flagpole.x_pos, floorPos_y,flagpole.x_pos, floorPos_y -210);
        //fill(155,150,100);
        noStroke();
    
        if(flagpole.isReached)
        {
            fill(128, 45, 0);
            ellipse(flagpole.x_pos, floorPos_y -210, 10, 30);
            fill(184, 243, 89);
            ellipse(flagpole.x_pos, floorPos_y -230, 30, 30);
            fill(184, 234, 89);
            ellipse(flagpole.x_pos, floorPos_y -250, 40, 20);
            fill(100, 230, 100);
            ellipse(flagpole.x_pos, floorPos_y -260, 60, 20);
        }
        else
        {
            fill(100, 230, 120)
            rect(flagpole.x_pos, floorPos_y -50, 50, 50)   
        }
    pop();
}

//check if flagpole reached
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15)
    {
        if(!isLevelCompleteSoundPlaying){
            isLevelCompleteSoundPlaying = true;
            levelCompleteSound.setVolume(0.2);
            levelCompleteSound.play();
        }        
        flagpole.isReached = true;
    }
   
}

//count lives
function checkPlayerDie()
{
    if(gameChar_y > height)
    {
        deathSound.setVolume(0.1);
        deathSound.play();
        backgroundSound.stop(); 
        player.isDead = true;

        if(lives != 0){
            lives -= 1;
        }        
        if(lives > 0)
        {
            //start game does not reset score to zero!
            startGame();
        }else{
            gameOver();
        }
    }

}

function restartGame()
{
    flagpole.isReached = false;
    lives = 3;
    game_score = 0;
    startGame();
}

//factory pattern used to create platform objects
function createPlatforms(x, y, length)
{
    return {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(150,75,0);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true; 
                }
            }
            return false;
        }
    }
}

// ---------------------
// Constructor functions
// ---------------------

//constructor function to create circle objects used for trees
function Circle(radius, r, g, b, alpha, x, y){
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;
    this.x = x;
    this.y = y;
    this.draw = function(){
      var c = color(this.r, this.g, this.b, this.alpha);
      fill(c);
      noStroke();
      ellipse(this.x, this.y, this.radius);
    }  
  }

//constructor function to create cloud objects and move them
function Cloud(x,y,size){
    this.x_pos = x;
    this.y_pos = y;
    this.size = size;

    this.draw = function(){
        fill(90);
        ellipse(this.x_pos + 2.25 * this.size,
                this.y_pos + 55,
                this.size * 1.75);
        ellipse(this.x_pos + 1.65 * this.size,
                this.y_pos + 55,
                this.size * 1.25);
        ellipse(this.x_pos + 3.25 * this.size,
                this.y_pos + 55,
                this.size * 1.95);
        ellipse(this.x_pos + 4.25 * this.size,
                this.y_pos + 55,
                this.size * 0.95);
        fill(255);
        ellipse(this.x_pos + 2.2 * this.size,
                this.y_pos + 50,
                this.size * 1.7);
        ellipse(this.x_pos + 1.6 * this.size,
                this.y_pos + 50,
                this.size * 1.2);
        ellipse(this.x_pos + 3.2 * this.size,
                this.y_pos + 50,
                this.size * 1.9);
        ellipse(this.x_pos + 4.2 * this.size,
                this.y_pos + 50,
                this.size * 0.9);
        fill(90);
        ellipse(this.x_pos + 2.6 * this.size,
                this.y_pos + 50, 
                this.size * 1.2);
        ellipse(this.x_pos + 3.2 * this.size,
                this.y_pos + 50,
                this.size * 1.1);
        fill(255);
        ellipse(this.x_pos + 2.55 * this.size,
                this.y_pos + 44, 
                this.size * 1.3);
        ellipse(this.x_pos + 3.25 * this.size,
                this.y_pos + 44,
                this.size * 1.2);
        fill(90);
        ellipse(this.x_pos + 2.4 * this.size,
                this.y_pos + 40,
                this.size * 0.7);
        ellipse(this.x_pos + 2.9 * this.size,
                this.y_pos + 40,
                this.size * 0.6);
        fill(255);
        ellipse(this.x_pos + 2.35 * this.size,
                this.y_pos + 45,
                this.size * 0.8);
        ellipse(this.x_pos + 2.95 * this.size,
                this.y_pos + 45,
                this.size * 0.7);
    }

    this.move = function(){
        this.x_pos += random(-0.05,-0.6);
        if(this.x_pos < -250)
        {
            this.x_pos = width + 50;
        }
    }
}

//constructor function to create mountain objects
function Mountain(x, y, height, width){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;

    this.draw = function()
    {
        fill(200, 232, 203);
        triangle(this.x, this.y,
                 this.x + this.width, this.y,
                 this.x + (this.width / 2), this.y - this.height);
        triangle(this.x, this.y,
                 this.x + this.width, this.y,
                 this.x + (this.width / 2), this.y - this.height);
    };

}

//constructor function to create canyon objects
function Canyon(x,width){
    this.x = x;
    this.width = width;

    // Function to draw canyon objects.
    this.draw = function()
    {
        fill(78, 182, 252);
        rect(this.x, floorPos_y  ,this.width,200);
        fill(204,255,250);
        rect(this.x, floorPos_y ,this.width,100);
    };
    // Function to check character is over a canyon.
    this.check = function()
    {
        if(gameChar_world_x > this.x && gameChar_world_x < this.x + this.width  && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
            gameChar_y += 2;
            isFalling = true;

        }
    }
}

//constructor function to create collectable objects
function Collectable(x, y, size, isFound)
{
    this.x_pos = x;
    this.y_pos = y;
    this.size = size;
    this.isFound = isFound;
    // Function to draw collectable objects.
    this.draw = function()
    {
        var scale = this.size / 100;
        var y_pos = this.y_pos - 20 * scale;
        // diamond
        stroke(0);
        
        fill(0, 126, 255, 70);
        triangle(this.x_pos - 20 * scale, y_pos, this.x_pos, y_pos + 20 * scale, this.x_pos + 20 * scale, y_pos);
        triangle(this.x_pos - 10 * scale, y_pos, this.x_pos, y_pos + 20 * scale, this.x_pos + 10 * scale, y_pos);
        triangle(this.x_pos - 20 * scale, y_pos, this.x_pos - 15 * scale, y_pos - 10 * scale, this.x_pos - 10 * scale, y_pos);
        triangle(this.x_pos + 10 * scale, y_pos, this.x_pos + 15 * scale, y_pos - 10 * scale, this.x_pos + 20 * scale, y_pos);
        triangle(this.x_pos - 10 * scale, y_pos, this.x_pos, y_pos - 10 * scale, this.x_pos + 10 * scale, y_pos);
        //Cycle colors based on the frame
        fill(135*frameCount%256, 206*frameCount%256, 250*frameCount%256, 170);
        triangle(this.x_pos - 15 * scale, y_pos - 10 * scale, this.x_pos - 10 * scale, y_pos, this.x_pos, y_pos - 10 * scale);
        triangle(this.x_pos, y_pos - 10 * scale, this.x_pos + 10 * scale, y_pos, this.x_pos + 15 * scale, y_pos - 10 * scale);
        noStroke();

    };
    // Function to check character has collected an item.
    this.check = function()
    {
        if(dist(gameChar_world_x, gameChar_y, this.x_pos, this.y_pos) < 20)
        {
            this.isFound = true;
            game_score += 1;
            collectSound.setVolume(0.1);
            collectSound.play();
        }

    };


}
    
//constructor function to create enemies
function Enemy(x, y, r ,g, b, s, range)
{
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.s = s;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    };
    
    this.draw = function()
    {
        this.update();
        push();
            translate(this.currentX, this.y);
       
            scale(this.s); // Set the scale
            var c = color(this.r, this.g, this.b);
            stroke(c); // Set the body colour
            strokeWeight(70);
            line(0, -35, 0, -65); // Body
            noStroke();
            fill(255 - this.g); //face
            ellipse(-17.5, -65, 35, 35); // Left eye dome
            ellipse(17.5, -65, 35, 35); // Right eye dome
            arc(0, -65, 70, 70, 0, PI); // Chin
            fill(this.g);
            ellipse(-14, -65, 8, 8); // Left eye
            ellipse(14, -65, 8, 8); // Right eye
            quad(0, -58, 4, -51, 0, -44, -4, -51); // Beak
        pop();
        
    };
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);        
        if(d < 20)
        {  
            if(lives != 0){
                lives -= 1;
            }        
            player.isDead = true;
            deathSound.setVolume(0.1);
            deathSound.play();
            return true;
        }        
        return false;
    }
}

//////////////////////////////////////////////
// Rain/snow Particle effect               ///
//////////////////////////////////////////////


//  A rain ParticleEmmiter constructor function
var ParticleEmmiter = function(position)
{
    this.origin = position.copy();
    this.particles = [];
};

ParticleEmmiter.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin));
};

ParticleEmmiter.prototype.run = function()
{
    for (var i = this.particles.length-1; i >= 0; i--) {
        var p = this.particles[i];
        p.run();
        if (p.isDead()) {
            //delete the particle from particles array
            this.particles.splice(i, 1);
        }
    }
};

//  A rain Particle constructor function
var Particle = function(position)
{
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-5,5), random(-1,0));
    this.position = position.copy();
    this.lifetime = 200;
};

Particle.prototype.run = function()
{
    this.update();
    this.display();
};

// Method to update position
Particle.prototype.update = function()
{
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifetime -=1;
};

// Method to display
Particle.prototype.display = function()
{
    stroke(235, this.lifetime);
    strokeWeight(2);
    //Cycle colors based on the frame
    fill(135*frameCount%256, this.lifetime);
    ellipse(this.position.x, this.position.y, 3,3);

};

// when is removed
Particle.prototype.isDead = function()
{
    return this.lifetime < 0;
};




//draw lives on the screen
function drawLives()
{
    for(var i = 0; i < lives; i++)
    {     
        stroke(0);
        strokeWeight(1);
        fill(255,200,0);
        ellipse(width - 120 + i * 30, 35, 30);
        fill(185,200,50);
        ellipse(width - 120 + i * 30 - 5, 35,10);
        ellipse(width - 120 + i * 30 + 5, 35, 10);
    }
    text("lives: " + lives, 20,60);
}

function gameOver(){
    fill(0, 126, 255, 200);
    rect(0,0,width, height);
    fill(255,180,150);
    textSize(55);
    text("Game over. Press space to continue.", 70,150);
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
    backgroundSound.setVolume(0);
    backgroundSound.stop();
    if(!isGameOverSoundPlaying){
        isGameOverSoundPlaying = true;
        gameOverSound.setVolume(0.05);
        gameOverSound.play();
    }
}