/*
https://freesound.org/:
 
Text-Message or Videogame-Jump by CmdRobot 

Videogame Death Sound by Fupicat

 Item Pickup by TreasureSounds
 
 WinFantasia.wav by Fupicat
 
 Game_over.wav by deleted_user_877451
 
 Haunting Sequence in G# or Ab.wav by afleetingspeck
 
*/

//The Game Project 7 - Extensions



var gameChar_x;
var gameChar_y;
var foot_xpos;
var char_Scale;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isLeft_fast;
var isRight;
var isRight_fast;
var isFalling;
var isPlummeting;

var treeScale;
var trees_x;
var trees_y;

var clouds;
var cloudScale;

var mountainScale;
var mountains;

var canyonWidth;
var canyons;

var collectableSize;
var collectables;
var collectable_isFound;

var game_score;
var flagpole;
var flagpole_ypos;

var lives;
var img;
var spotlight;
var moon;
var darkness;
var brightness;

var flashlight;
var dark;

var jumpSound;
var textSound;
var clickSound;
var death;
var pickup;
var win;
var gameOver;
var backgroundSound;

var enemies;
var monster;

function preload()
{
    
    
    //load your sounds here
    soundFormats('mp3','wav', 'ogg');
    
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.5);
    
    backgroundSound = loadSound('assets/scary ambience.wav');
    creepySound = loadSound('assets/scaryViolins.ogg');
    
    textSound = loadSound('assets/text.ogg');
    textSound.setVolume(1);
    
    clickSound = loadSound('assets/click.wav');
    
    pickup = loadSound('assets/pickup.ogg');
    
    death = loadSound('assets/death.wav');
    death.setVolume(0.5);
    
    win = loadSound('assets/win.wav');
    win.setVolume(1);
    
    gameOver = loadSound('assets/gameover.wav');
    
    backgroundSound = loadSound('assets/scaryplace.wav');
    backgroundSound.setVolume(0.3);
    
    //loading images
    spotlight = loadImage("spotlight copy.png");
    monster = loadImage("monster3.png");
    
}

function setup()
{
	createCanvas(1024, 576);
    
    

    
	floorPos_y = height * 3/4;
    
    
    
    
	
	
	lives = 3;
	
	startGame();
    
    backgroundSound.play();
    
   
    
    
    
	brightness = 255;
    darkness= 0;
    dark = 0;
    
    
	
}

function draw()
{
    
    background(100, 155, 255, brightness);// fill the sky blue
    brightness-=1;
    
    background(12, 20, 69, darkness); // fill the night sky
    darkness+=1;
    

    
    
    drawMoon();
	
	
	//moving canvas
	push();
	translate(scrollPos,0);
    
    
    

	// Draw clouds.
	drawClouds();

	// Draw mountains.
	drawMountains();


	// Draw canyons/ground.
	for (var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	
	// Draw trees.
	drawTrees();
    
	
	
	// Draw collectable items.	
/*We now need to make sure that the collectable is not drawn once it has been found. 

Add a conditional statement to the same `for loop` which prevents both functions being called if that collectable's `isFound` property is `true`.

Test your code to check that collectables disappear when the game character collides with them.*/

	for (var i = 0; i < collectables.length; i++)
	{
			if(collectables[i].isFound == false)
			{
				drawCollectable(collectables[i]);
				checkCollectable(collectables[i]);
				
			}
			
	}
	
	// draw flagpole
	renderFlagpole();
    
    
    //enemies
    for(var i=0; i< enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y)
        
        if(isContact)
        {
            if(lives>0)
            {
                lives-=1;
                startGame();
                
                break;
            }
        }
    }
    
   
    
    //text message
    fill(255, 255, 255, brightness);
    triangle();
    ellipse(440, 500, 450, 80)
    fill(0, 0, 0, brightness);
	textSize(15);
    text("💬 New Message ", 240, 460);
    text("It's getting dark. Your flashlight should keep you alive.", 280, 490);
    text("Just get home before your battery dies...and be careful.", 280, 510);
    
    
	pop();
    
    
    //darkness
    if (darkness>50 && dark!==180)
    {
        dark+=1
        fill(0, 0, 0, dark);
        rect(0, 0, width, height);
        
    }
    else if ( dark==180)
    {
        dark=180
        fill(0, 0, 0, dark);
        rect(0, 0, width, height);
    }
    
    
   //moonshine
    tint(255, dark);
    image(spotlight, moon.x-75, moon.y-75, 150,150);
  
    
    // Draw game character.
    
	drawGameChar();
	
	//Draw Game Score
    noStroke();
	fill(255,255,0);
	textSize(35);
	textFont('Times');
	text(game_score + "% 🔋", 10, 35);
    
    
 
    //battery life
    if ((frameCount==300||frameCount==600||frameCount==900||frameCount==1200||frameCount==1500||frameCount==1800||frameCount==2100||frameCount==2400||frameCount==2700||frameCount==3000)&& flagpole.isReached ==false && lives > 0 && game_score >= 0)
    {
        game_score= game_score-1;

        if(game_score < 0)
        {
            game_score-=1;
            lives-=1;
            startGame();
            
            if(lives<1)
            {
                game_score-=1;
            }
            
        }
        
        if(game_score > 9 && lives > 0)
        {
            frameRate(1);
            game_score= game_score-9;
   
        }
        
    
    }
           
	
	//draw Game Lives
    noStroke();
	checkPlayerDie()
	fill(255,0,0);
	textSize(35);
	textFont('Times');
	text(" ♥  x  " + lives, 915, 35);
    
    
	
	if (lives < 1)
	{
		textSize(100)
		text("GAME OVER", width/5, height/2);
		textSize(25);
		text("Press Spacebar to Continue", width/3+45, height/2+100);
		return;
        
	}
    
	

	
	if (flagpole.isReached)
	{
		noStroke();
        fill(135,206,250);
		textSize(100);
		text("LEVEL COMPLETE", width/12, height/2);
		textSize(25);
		text("Press Spacebar to Continue", width /3+45, height/2+100);
		return;
	}
	
	

	// Logic to make the game character move or the background scroll.

	
	
	if(isLeft)
	{
		if(gameChar_x > width * 0.5)
		{
			gameChar_x -= 4;
            
		}
		else
		{
			scrollPos += 4;
		}
	}
	if(isLeft_fast)
	{
		if(gameChar_x > width * 0.5)
		{
			gameChar_x -= 6;
		}
		else
		{
			scrollPos += 6;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.5)
		{
			gameChar_x  += 4;
		}
		else
		{
			scrollPos -= 4; // negative for moving against the background
		}
	}
	if(isRight_fast)
	{
		if(gameChar_x < width * 0.5)
		{
			gameChar_x  += 6;
		}
		else
		{
			scrollPos -= 6;
		}
	}
	
	//jumping left
	if (isFalling && isLeft 
		&& gameChar_y < floorPos_y+100)
	{
		frameRate(4);
		gameChar_x -= 100;
	}

	//jumping right
	if (isFalling && isRight 
		&& gameChar_y < floorPos_y+100)
	{
		frameRate(4);
		gameChar_x += 100;
	}

	
	//if in the air, falling back down
	if (gameChar_y < floorPos_y+100)
	{
		frameRate(4);
		gameChar_y += 100;
		isFalling = true;
		
	}
	//once on the ground, it switches to standing
	else 
	{
		frameRate(30);
		isFalling = false;
		
	}	
	
	
	//check if flagpole is reached
	if (flagpole.isReached == false)
	{
	
		checkFlagpole();
	}
	
	
	//update real position of character for collision detection
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{ 
    

	// if statements to control the animation of the character when
	// keys are pressed.

	if (keyCode == 37)
	{
		
		isLeft = true;
        
        clickSound.play();
        
	}
	else if (keyCode == 39)
	{
		
		isRight = true;
        clickSound.play();
        
	}
	if (keyCode == 91 && isLeft == true)
	{
		isLeft_fast = true;
        clickSound.play();
        
	}
	else if (keyCode == 91 && isRight == true)
	{
		isRight_fast = true;
        clickSound.play();
        
	}
	
	
	
	//hitting the spacebar makes it jump up, left, or right
	//except when plummeting down or already in the air
    
    
	
	
	if (keyCode == 32 && gameChar_y < floorPos_y+105 && gameChar_y > floorPos_y+99 
		&& isPlummeting == false && isFalling == false)
	{
		
		frameRate(4);
		isFalling = true;
		gameChar_y -= 100;
        jumpSound.play();
        

		
		if (isLeft)
		{
			frameRate(10);
			gameChar_x -= 50;
		
		}
		else if (isRight)
		{
			frameRate(10);
			gameChar_x += 50;
			
		}
	}
	
}



function keyReleased()
{

	// if statements to control the animation of the character when
	// keys are released.
	
	if (keyCode == 37)
	{
		
		isLeft = false;
	}
	else if (keyCode == 39)
	{
		
		isRight = false;
	}
	if (keyCode == 91)
	{
		isRight_fast = false;
		isLeft_fast  = false;
	}
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		
		//neck
		fill(255,0,255);
		noStroke();
		rect(gameChar_x-3*char_Scale,
			 gameChar_y-47*char_Scale,
			 5*char_Scale,
			 10*char_Scale);
		//head
		ellipse(gameChar_x,
				gameChar_y-57*char_Scale,
				35*char_Scale,
				25*char_Scale);
		//glasses
		fill(255);
		stroke(0);
		strokeWeight(1*char_Scale);
		ellipse(gameChar_x-15*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		//mouth
		line(gameChar_x-13*char_Scale,
			 gameChar_y-49*char_Scale,
			 gameChar_x-12*char_Scale,
			 gameChar_y-49*char_Scale);
		//eyes
		fill(0);
		stroke(0,255,100);
		ellipse(gameChar_x-17*char_Scale,
				gameChar_y-57*char_Scale,
				5*char_Scale,5*char_Scale);
		fill(255);
		noStroke();
		ellipse(gameChar_x-16*char_Scale,
				gameChar_y-59*char_Scale,
				3*char_Scale,3*char_Scale);
		//body
		fill(0,200,255);
		rect(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 10*char_Scale,15*char_Scale);
		//arms
		stroke(10,180,255);
		line(gameChar_x-4*char_Scale,
			 gameChar_y-42*char_Scale,
			 gameChar_x-15*char_Scale,
			 gameChar_y-47*char_Scale);
		//leg
		stroke(0,200,255);
		line(gameChar_x-1*char_Scale,
			 gameChar_y-27*char_Scale,
			 gameChar_x-7*char_Scale,
			 gameChar_y-25*char_Scale);
		//foot
		line(gameChar_x-7*char_Scale,
			 gameChar_y-25*char_Scale,
			 gameChar_x, 
			 gameChar_y-23*char_Scale);


	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		
		//neck
		fill(255,0,255);
		noStroke();
		rect(gameChar_x-3*char_Scale,
			 gameChar_y-47*char_Scale,
			 5*char_Scale,
			 10*char_Scale);
		//head
		ellipse(gameChar_x,
				gameChar_y-57*char_Scale,
				35*char_Scale,
				25*char_Scale);
		//glasses
		fill(255);
		stroke(0);
		strokeWeight(1*char_Scale);
		ellipse(gameChar_x+15*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		//mouth
		line(gameChar_x+13*char_Scale,
			 gameChar_y-49*char_Scale,
			 gameChar_x+12*char_Scale,
			 gameChar_y-49*char_Scale);
		//eyes
		fill(0);
		stroke(0,255,100);
		ellipse(gameChar_x+17*char_Scale,
				gameChar_y-57*char_Scale,
				5*char_Scale,5*char_Scale);
		fill(255);
		noStroke();
		ellipse(gameChar_x+16*char_Scale,
				gameChar_y-59*char_Scale,
				3*char_Scale,3*char_Scale);
		//body
		fill(0,200,255);
		rect(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 10*char_Scale,15*char_Scale);
		//arms
		stroke(10,180,255);
		line(gameChar_x+4*char_Scale,
			 gameChar_y-42*char_Scale,
			 gameChar_x+15*char_Scale,
			 gameChar_y-47*char_Scale);
		//leg
		stroke(0,200,255);
		line(gameChar_x+1*char_Scale,
			 gameChar_y-27*char_Scale,
			 gameChar_x+7*char_Scale,
			 gameChar_y-25*char_Scale);
		//foot
		line(gameChar_x+7*char_Scale,
			 gameChar_y-25*char_Scale,
			 gameChar_x, 
			 gameChar_y-23*char_Scale);

	


	}
	else if(isLeft)
	{
		// add your walking left code
		
		//neck
		fill(255,0,255);
		noStroke();
		rect(gameChar_x-3*char_Scale,
			 gameChar_y-47*char_Scale,
			 5*char_Scale,
			 10*char_Scale);
		//head
		ellipse(gameChar_x,
				gameChar_y-57*char_Scale,
				35*char_Scale,
				25*char_Scale);
		//glasses
		fill(255);
		stroke(0);
		strokeWeight(1*char_Scale);
		ellipse(gameChar_x-15*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		//mouth
		line(gameChar_x-13*char_Scale,
			 gameChar_y-49*char_Scale,
			 gameChar_x-12*char_Scale,
			 gameChar_y-49*char_Scale);
		//eyes
		fill(0);
		stroke(0,255,100);
		ellipse(gameChar_x-17*char_Scale,
				gameChar_y-57*char_Scale,
				5*char_Scale,
				5*char_Scale);
		fill(255);
		noStroke();
		ellipse(gameChar_x-16*char_Scale,
				gameChar_y-59*char_Scale,
				3*char_Scale,
				3*char_Scale);
		//body
		fill(0,200,255);
		rect(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 10*char_Scale,
			 15*char_Scale);
		//arms
		stroke(10,180,255);
		line(gameChar_x,gameChar_y-42*char_Scale,
			 gameChar_x,gameChar_y-34*char_Scale);
		line(gameChar_x,gameChar_y-34*char_Scale,
			 gameChar_x-6*char_Scale,
			 gameChar_y-27*char_Scale);
		//leg
		stroke(0,200,255);
		line(gameChar_x+1, 
			 gameChar_y-27*char_Scale,
			 gameChar_x+(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
			 
		//foot
		line(gameChar_x+(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale,
			 gameChar_x-(3-sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
		
		//leg
		line(gameChar_x+1, 
			 gameChar_y-27*char_Scale,
			 gameChar_x-(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
			 
		//foot
		line(gameChar_x-(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale,
			 gameChar_x-(3+sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
		foot_xpos += 0.5;
        
        //flashlight
        stroke(0);
        strokeWeight(2);
        line(gameChar_x-10, gameChar_y-38, gameChar_x-15, gameChar_y-38);
        noStroke();
        tint(255,150);
        if (game_score >= 1)
        {
            image(spotlight, gameChar_x-350, gameChar_y-180, 100 , 270 );
            fill(255, 255, 255, 50);
            triangle(gameChar_x-15, gameChar_y-38, gameChar_x-300, gameChar_y-150, gameChar_x-300, gameChar_y+50);
        }
        
    

	}
	else if(isRight)
	{
		// add your walking right code
		
		//neck
		fill(255,0,255);
		noStroke();
		rect(gameChar_x-3*char_Scale,
			 gameChar_y-47*char_Scale,
			 5*char_Scale,
			 10*char_Scale);
		//head
		ellipse(gameChar_x,
				gameChar_y-57*char_Scale,
				35*char_Scale,
				25*char_Scale);
		//glasses
		fill(255);
		stroke(0);
		strokeWeight(1*char_Scale);
		ellipse(gameChar_x+15*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		//mouth
		line(gameChar_x+13*char_Scale,
			 gameChar_y-49*char_Scale,
			 gameChar_x+12*char_Scale,
			 gameChar_y-49*char_Scale);
		//eyes
		fill(0);
		stroke(0,255,100);
		ellipse(gameChar_x+17*char_Scale,
				gameChar_y-57*char_Scale,
				5*char_Scale,
				5*char_Scale);
		fill(255);
		noStroke();
		ellipse(gameChar_x+16*char_Scale,
				gameChar_y-59*char_Scale,
				3*char_Scale,
				3*char_Scale);
		//body
		fill(0,200,255);
		rect(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 10*char_Scale,
			 15*char_Scale);
		//arms
		stroke(10,180,255);
		line(gameChar_x,gameChar_y-42*char_Scale,
			 gameChar_x,gameChar_y-34*char_Scale);
		line(gameChar_x,gameChar_y-34*char_Scale,
			 gameChar_x+6*char_Scale,
			 gameChar_y-27*char_Scale);
		//leg
		stroke(0,200,255);
		line(gameChar_x+1, 
			 gameChar_y-27*char_Scale,
			 gameChar_x+(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
			 
		//foot
		line(gameChar_x+(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale,
			 gameChar_x+(3+sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
		
		//leg
		line(gameChar_x+1, 
			 gameChar_y-27*char_Scale,
			 gameChar_x-(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
			 
		//foot
		line(gameChar_x-(sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale,
			 gameChar_x+(3-sin(foot_xpos*125)*5)*char_Scale,
			 gameChar_y-17*char_Scale);
		foot_xpos += 0.5;
        //flashlight
        stroke(0);
        strokeWeight(2);
        line(gameChar_x+10, gameChar_y-38, gameChar_x+15, gameChar_y-38);
        noStroke();
        tint(255,150);
        if (game_score >= 1)
        {
            image(spotlight, gameChar_x+250, gameChar_y-180, 100 , 270 );
            fill(255, 255, 255, 50);
            triangle(gameChar_x+15, gameChar_y-38, gameChar_x+300, gameChar_y-150, gameChar_x+300, gameChar_y+50);
        }

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code

		//neck
		fill(255,0,255);
		noStroke();
		rect(gameChar_x-3*char_Scale,
			 gameChar_y-47*char_Scale,
			 5*char_Scale,
			 10*char_Scale);
		//head
		ellipse(gameChar_x,
				gameChar_y-57*char_Scale,
				35*char_Scale,
				25*char_Scale);
		//glasses
		fill(255);
		stroke(0);
		strokeWeight(1*char_Scale);
		ellipse(gameChar_x-10*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		ellipse(gameChar_x+10*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		line(gameChar_x-5*char_Scale,
			 gameChar_y-57*char_Scale,
			 gameChar_x+5*char_Scale,
			 gameChar_y-57*char_Scale);
		//mouth
		line(gameChar_x-3*char_Scale,
			 gameChar_y-49*char_Scale,
			 gameChar_x+2*char_Scale,
			 gameChar_y-49*char_Scale);
		//eyes
		fill(0);
		stroke(0,255,100);
		ellipse(gameChar_x-10*char_Scale,
				gameChar_y-57*char_Scale,
				5*char_Scale,
				5*char_Scale);
		ellipse(gameChar_x+10*char_Scale,
				gameChar_y-57*char_Scale,
				5*char_Scale,
				5*char_Scale);
		fill(255);
		noStroke();
		ellipse(gameChar_x-11*char_Scale,
				gameChar_y-59*char_Scale,
				3*char_Scale,
				3*char_Scale);
		ellipse(gameChar_x+9*char_Scale,
				gameChar_y-59*char_Scale,
				3*char_Scale,
				3*char_Scale);
		//body
		fill(0,200,255);
		rect(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 10*char_Scale,
			 15*char_Scale);
		//arms
		stroke(0,200,255);
		line(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 gameChar_x-10*char_Scale,
			 gameChar_y-50*char_Scale);
		line(gameChar_x+4*char_Scale,
			 gameChar_y-42*char_Scale,
			 gameChar_x+10*char_Scale,
			 gameChar_y-50*char_Scale);
		//legs
		line(gameChar_x-2*char_Scale,
			 gameChar_y-27*char_Scale,
			 gameChar_x-2*char_Scale,
			 gameChar_y-22*char_Scale);
		line(gameChar_x+1*char_Scale,
			 gameChar_y-27*char_Scale,
			 gameChar_x+1*char_Scale,
			 gameChar_y-22*char_Scale);

	}
	else
	{
		// add your standing front facing code
        
		//neck
		fill(255,0,255);
		noStroke();
		rect(gameChar_x-3*char_Scale,
			 gameChar_y-47*char_Scale,
			 5*char_Scale,
			 10*char_Scale);
		//head
		ellipse(gameChar_x,
				gameChar_y-57*char_Scale,
				35*char_Scale,
				25*char_Scale);
		//glasses
		fill(255);
		stroke(0);
		strokeWeight(1*char_Scale);
		ellipse(gameChar_x-10*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		ellipse(gameChar_x+10*char_Scale,
				gameChar_y-57*char_Scale,
				10*char_Scale,
				10*char_Scale);
		line(gameChar_x-5*char_Scale,
			 gameChar_y-57*char_Scale,
			 gameChar_x+5*char_Scale,
			 gameChar_y-57*char_Scale);
		//mouth
		line(gameChar_x-3*char_Scale,
			 gameChar_y-49*char_Scale,
			 gameChar_x+2*char_Scale,
			 gameChar_y-49*char_Scale);
		//eyes
		fill(0);
		stroke(0,255,100);
		ellipse(gameChar_x-10*char_Scale,
				gameChar_y-57*char_Scale,
				5*char_Scale,
				5*char_Scale);
		ellipse(gameChar_x+10*char_Scale,
				gameChar_y-57*char_Scale,5*char_Scale,
				5*char_Scale);
		fill(255);
		noStroke();
		ellipse(gameChar_x-11*char_Scale,
				gameChar_y-59*char_Scale,3*char_Scale,
				3*char_Scale);
		ellipse(gameChar_x+9*char_Scale,
				gameChar_y-59*char_Scale,
				3*char_Scale,
				3*char_Scale);
		//body
		fill(0,200,255);
		rect(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 10*char_Scale,
			 15*char_Scale);
		//arms
		stroke(0,200,255);
		line(gameChar_x-5*char_Scale,
			 gameChar_y-42*char_Scale,
			 gameChar_x-10*char_Scale,
			 gameChar_y-27*char_Scale);
		line(gameChar_x+4*char_Scale,
			 gameChar_y-42*char_Scale,
			 gameChar_x+10*char_Scale,
			 gameChar_y-27*char_Scale);
		//legs
		line(gameChar_x-2*char_Scale,
			 gameChar_y-27*char_Scale,
			 gameChar_x-2*char_Scale,
			 gameChar_y-17*char_Scale);
		line(gameChar_x+1*char_Scale,
			 gameChar_y-27*char_Scale,
			 gameChar_x+1*char_Scale,
			 gameChar_y-17*char_Scale);
        
       
        //flashlight
        stroke(0);
        strokeWeight(5);
        point(gameChar_x+14, gameChar_y-38);
        
		

	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
	for (var i = 0; i < clouds.length; i++)
	{
        
		noStroke();
		fill(255,255,255);
		ellipse(clouds[i].pos_x,
				clouds[i].pos_y,
				200*cloudScale[i],
				75*cloudScale[i]);
		ellipse(clouds[i].pos_x+125*cloudScale[i],
				clouds[i].pos_y+25*cloudScale[i],
				200*cloudScale[i],
				75*cloudScale[i]);
		ellipse(clouds[i].pos_x,
				clouds[i].pos_y-25*cloudScale[i],
				200*cloudScale[i],
				75*cloudScale[i]);
		ellipse(clouds[i].pos_x+50*cloudScale[i],
				clouds[i].pos_y-50*cloudScale[i],
				200*cloudScale[i],
				75*cloudScale[i]);
		ellipse(clouds[i].pos_x+250*cloudScale[i],
				clouds[i].pos_y+10*cloudScale[i],
				200*cloudScale[i],
				100*cloudScale[i]);
		ellipse(clouds[i].pos_x+175*cloudScale[i],
				clouds[i].pos_y-40*cloudScale[i],
				225*cloudScale[i],
				100*cloudScale[i]);
		ellipse(clouds[i].pos_x+285*cloudScale[i],
				clouds[i].pos_y-25*cloudScale[i],
				200*cloudScale[i],
				100*cloudScale[i]);
        
	}
    

}
// Function to draw mountains objects.
function drawMountains()
{
	for (var i = 0; i < mountains.length; i++)
	{
		
		fill(60,52,3);
		noStroke();
		triangle(mountains[i].pos_x-140*mountainScale[i].width,
				 mountains[i].pos_y,
				 mountains[i].pos_x+200*mountainScale[i].width,
				 mountains[i].pos_y,
				 mountains[i].pos_x+40,
				 mountains[i].pos_y-200*mountainScale[i].height);
		
		fill(60,52,3);
		triangle(mountains[i].pos_x, mountains[i].pos_y, 
				 mountains[i].pos_x+350*mountainScale[i].width, 
				 mountains[i].pos_y, 
				 mountains[i].pos_x+175, 
				 mountains[i].pos_y-232*mountainScale[i].height);
	}
	
}

// Function to draw trees objects.
function drawTrees()
{
    
    
	for (var i = 0; i < trees_x.length; i++)
	{
        
        
		//trunk
		fill(139,69,19);
		rect(trees_x[i]+20*treeScale[i]-canyonWidth,
			 trees_y[i]+10*treeScale[i],
			 25*treeScale[i],
			 175*treeScale[i]);
		//branches
		fill(0,255,157);
		noStroke(0);
		ellipse(trees_x[i]-canyonWidth,
				trees_y[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth-65*treeScale[i],
				trees_y[i]-40*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth-105*treeScale[i],
				trees_y[i]-100*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth-85*treeScale[i],
				trees_y[i]-150*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth+15*treeScale[i],
				trees_y[i]-150*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth+115*treeScale[i],
				trees_y[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth+165*treeScale[i],
				trees_y[i]-30*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth+163*treeScale[i],
				trees_y[i]-97*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth+130*treeScale[i],
				trees_y[i]-140*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);
		ellipse(trees_x[i]-canyonWidth+5*treeScale[i],
				trees_y[i]-75*treeScale[i],
				200*treeScale[i],
				100*treeScale[i]);

	}

}

//function to draw moon
function drawMoon()
{

	fill(255,255,224, moon.brightness);
    noStroke();
	ellipse(moon.x, moon.y, moon.diameter);
	moon.x=min(moon.x+0.5,400)
	moon.y=max(moon.y-0.1,75)
    moon.brightness=moon.brightness+1
	
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	
		
		fill(61,43,31);
		rect(t_canyon.pos_x,
			 t_canyon.pos_y,700,28);
		ellipse(t_canyon.pos_x+700,
				t_canyon.pos_y+3,250,50);
		ellipse(t_canyon.pos_x+110,
				t_canyon.pos_y+5,1330,75);

		fill(0,100,0);
		rect(t_canyon.pos_x,
			 t_canyon.pos_y+28,
			 820-canyonWidth+50,
			 100);

		fill(50,150,150);
		ellipse(t_canyon.pos_x+50-canyonWidth+50,
				t_canyon.pos_y+20,1410,80);
		rect(t_canyon.pos_x,
			 t_canyon.pos_y+18,
			 700-canyonWidth+50,
			 35);

		fill(0,100,0);
		rect(t_canyon.pos_x+775,
			 t_canyon.pos_y,
			 200,
			 45);

		fill(100,140,150);
		ellipse(t_canyon.pos_x+1200,
			 t_canyon.pos_y+10,
			 800,
			 60);
		ellipse(t_canyon.pos_x+897,
				t_canyon.pos_y+3,
				250,
				50);

		fill(50,150,150);
		ellipse(t_canyon.pos_x+700-canyonWidth+50,
				t_canyon.pos_y+28,
				250,
				55);

		fill(0,128,128);
		ellipse(t_canyon.pos_x+950,
				t_canyon.pos_y+38,
				200,
				70);
		ellipse(t_canyon.pos_x+1350,
			 t_canyon.pos_y+38,
			 1000,
			 110);

		fill(0,100,0);
		rect(t_canyon.pos_x+750,
			 t_canyon.pos_y+93,
			 300,
			 100);
		
		fill(0,155,0);
		ellipse(t_canyon.pos_x+905,
				t_canyon.pos_y+93,
				300,
				107);
		ellipse(t_canyon.pos_x+1450,
			 t_canyon.pos_y+93,
			 1400,
			 210);

		//draw some green ground
		
		noStroke();
		fill(0,100,0);
		rect(t_canyon.pos_x,
			 t_canyon.pos_y+60,
			 695-canyonWidth+55,
			 200);

		fill(0, 155, 0);
		ellipse(t_canyon.pos_x-canyonWidth, 
			 t_canyon.pos_y+70, 
			 1476, 
			 180);
		rect(t_canyon.pos_x-740-canyonWidth,
			 t_canyon.pos_y+70,
			 400,
			 80);
		triangle(t_canyon.pos_x,
				 t_canyon.pos_y+88,
				 t_canyon.pos_x+645-canyonWidth+55,
				 t_canyon.pos_y+88,
				 t_canyon.pos_x,
				 t_canyon.pos_y+144);
		ellipse(t_canyon.pos_x+550-canyonWidth+55,
				t_canyon.pos_y+70,
				300,80);
	
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	//if it walks/jumps into the canyon, it plummets
	for (var i = 0; i < canyons.length; i++)
	{
			
		if (t_canyon.pos_x+750-canyonWidth < gameChar_world_x 
		&& gameChar_world_x < t_canyon.pos_x+755)
		{
            
			keyCode = 0;
			isPlummeting = true;
			gameChar_y += 1;
            
            

            
				
		}
		
	//if it stays on the ground it's safe
		else if (gameChar_y < floorPos_y+105 
		&& gameChar_y > floorPos_y+99) 
		{
			isPlummeting = false;
	
		}
	//if it doesn't stay on the ground, it plummets
        if (isPlummeting == true)
        {
            isPlummeting == true;
            gameChar_y += 1;
        }
		if (gameChar_y > floorPos_y+105
                && gameChar_y< 550)
		{
			isPlummeting = true;
            death.play();
    
		}
        
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
	
	fill(0.,255,0);
	stroke(255,215,0,200);
	strokeWeight(7);
    line(t_collectable.pos_x+10, t_collectable.pos_y-3,t_collectable.pos_x+20, t_collectable.pos_y-3);
    strokeWeight(2);
    rect(t_collectable.pos_x,
			t_collectable.pos_y,1*collectableSize,
			1.5*collectableSize);
	fill(200,100,0,100);
    textSize(35);
	text(" ⚡",t_collectable.pos_x-10, t_collectable.pos_y+37);
	
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if (dist(gameChar_world_x,
			 gameChar_y,
			 t_collectable.pos_x,
			 t_collectable.pos_y) < collectableSize*4.5)
	{
		t_collectable.isFound = true;
		game_score += 9;
        pickup.play();
	}
    
}

function renderFlagpole()
{
    //house
    //structure
    fill(75,54,33);
    noStroke();
    rect(flagpole.x_pos, 360, 250, 150);
    triangle(flagpole.x_pos, 360, 
             flagpole.x_pos+250, 360, 
             flagpole.x_pos+130, 310);
    //roof
    stroke(50,20,20);
    strokeWeight(30);
    line(flagpole.x_pos-10, 370, flagpole.x_pos+130, 310);
    line(flagpole.x_pos+260, 370, flagpole.x_pos+130, 310);
    //chimney
    stroke(0);
    line(flagpole.x_pos+30, 320,flagpole.x_pos+ 30, 335);
    fill(255, 255, 255, 100);
    noStroke();
    ellipse(flagpole.x_pos+30, 280, 30, 30);
    ellipse(flagpole.x_pos+50, 240, 30, 30);
    ellipse(flagpole.x_pos+80, 200, 30, 30);
    //door
    noStroke();
    fill(50,20,20);
    rect(flagpole.x_pos+100, 430, 50, 80);
    stroke(108,84,30);
    strokeWeight(8);
    point(flagpole.x_pos+140, 475);
    //windows
    noStroke();
    fill(255, 255, 0);
    rect(flagpole.x_pos+20, 400, 60, 60);
    rect(flagpole.x_pos+170, 400, 60, 60);
    image(spotlight, flagpole.x_pos, 380, 100, 100);
    image(spotlight, flagpole.x_pos+150, 380, 100, 100);
    stroke(50,20,20);
    strokeWeight(4);
    line(flagpole.x_pos+20, 430, flagpole.x_pos+80, 430);
    line(flagpole.x_pos+50, 400, flagpole.x_pos+50, 460);
    line(flagpole.x_pos+170, 430, flagpole.x_pos+230, 430);
    line(flagpole.x_pos+200, 400, flagpole.x_pos+200, 460);
   
    //flag
    stroke(255);
	strokeWeight(5);
	line(flagpole.x_pos-20,floorPos_y+73,flagpole.x_pos-20, floorPos_y-280);
	fill(0,191,255);
    noStroke();
	triangle(flagpole.x_pos-20,flagpole.y_pos-30, 
			flagpole.x_pos-20,flagpole.y_pos,
			flagpole.x_pos+50,flagpole.y_pos-15)
    
	
	if (flagpole.isReached)
	{
		flagpole.y_pos -= 5;
		if (flagpole.y_pos < 182)
		{
			flagpole.y_pos += 5;
			
		}
			
	}
	
}

function checkFlagpole()
{
	var d = abs(gameChar_world_x-flagpole.x_pos);
	if ( d < 15 )
	{
		flagpole.isReached = true;
        win.play();
		
	}
		
}


function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x+this.range)
        {
            this.inc = -1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw= function()
    {
        this.update();
        fill(255, 0, 0);
        image(monster, this.currentX, this.y, 100, 100);
        
        
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = int(dist(gc_x, gc_y, this.currentX+50, this.y+120));
        
        //console.log(gc_x, gc_y, this.currentX+50, this.y+120);
        
        if(d < 65)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}



function checkPlayerDie()
{
	if ((gameChar_y > 590 && gameChar_y < 700) && lives>0)
	{
		lives -= 1;
    
		if (lives > 0 )
		{
            
			startGame();
             
		}
		else if (lives ==0)
		{
            gameOver.play();
		}
        
    }
  
    
	
	
}

function startGame()
{
    
    textSound.play();
    
    
	gameChar_x = width/2-300;
	gameChar_y = floorPos_y+100;
	char_Scale = 1.4;
	// 1 < char_Scale < 3
	foot_xpos = 0;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isLeft_fast = false;
	isRight = false;
	isRight_fast = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	treeScale = [0.7,0.6,0.7,0.65,0.4,0.7,0.6,0.7,0.65,0.4,0.65,0.4,0.7];
	trees_x = [100,400,1600,1900,2700,3000,3300,4200,4500,5000,5500,6000];
	trees_y = [332,330,350,370,340,330,350,350,370,350,370,360];
	
	cloudScale = [0.5,0.5,0.6,0.5,0.4,0.3,0.5,0.6,0.5,0.4,0.3,0.5,0.6];
	// 0 < scale < 1
	clouds = [
		{pos_x : 100, pos_y : 160},
		{pos_x : 600, pos_y : 170},
		{pos_x : 800, pos_y : 200},
		{pos_x : 1200, pos_y : 170},
		{pos_x : 1800, pos_y : 160},
		{pos_x : 2100, pos_y : 170},
		{pos_x : 2700, pos_y : 150},
		{pos_x : 3500, pos_y : 170},
		{pos_x : 3800, pos_y : 160},
		{pos_x : 4400, pos_y : 150},
		{pos_x : 5000, pos_y : 160},
		{pos_x : 5400, pos_y : 150},
		{pos_x : 6000, pos_y : 170}
	];
	
	mountainScale = [
		{width : 3, height : 0.9},
		{width : 3, height : 1},
		{width : 3, height : 0.9}
	];
	mountains = [
		{pos_x : width/2+200, pos_y : floorPos_y},
		{pos_x : width/2+2700, pos_y : floorPos_y},
		{pos_x : width/2+5500, pos_y : floorPos_y}
	];

	canyonWidth = 100;
		// 50 < width < 200
	canyons = [
		{pos_x : 0, pos_y : floorPos_y},
		{pos_x : 2700, pos_y : floorPos_y},
		{pos_x : 5400, pos_y : floorPos_y}
	];
	
	collectableSize = 30;
	//30<size<50
	collectables = [ 
		{pos_x : 700, pos_y : 410, isFound: false},
		{pos_x : 760, pos_y : 415, isFound: false},
		{pos_x : 820, pos_y : 440, isFound: false},
		{pos_x : 1950, pos_y : 300,isFound: false},
		{pos_x : 2030, pos_y : 280,isFound: false},
		{pos_x : 2100, pos_y : 320,isFound: false},
		{pos_x : 3400, pos_y : 410,isFound: false},
		{pos_x : 3460, pos_y : 415,isFound: false},
		{pos_x : 3520, pos_y : 440,isFound: false},
		{pos_x : 6100, pos_y : 410,isFound: false},
		{pos_x : 6160, pos_y : 415,isFound: false},
		{pos_x : 6220, pos_y : 440,isFound: false}
		
	];
	
	game_score = 1;
	
	
	flagpole = {
		isReached: false,
		x_pos: 6500,
		y_pos: floorPos_y+43
	};
    moon = {
        x: 0,
        y: 150,
        diameter: 50,
        brightness:0,
    };

    enemies = [];
    enemies.push(new Enemy(1200, floorPos_y-20, 100));
	
}


