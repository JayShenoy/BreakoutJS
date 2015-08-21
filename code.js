var sketchProc = function(processingInstance) {
  with(processingInstance) {
    size(600, 400);

    background(0, 0, 0);

    /* Scenes
    Scene 0 - Start screen
    Scene 1 - Beginner level
    Scene 2 - Intermediate level
    Scene 3 - Extreme level
    Scene 4 - You Lose screen
    Scene 5 - You Win screen (beginner and intermediate)
    Scene 6 - You Win screen (extreme) */

    // Define the scene information
    var currentScene = 0;
    // Store the next level to play if the user wins the current level
    var nextLevel;

    // Define the start screen information
    var titleX = width * (17 / 60);
    var titleY = height / 4;
    var titleSize = width / 12;
    var beginnerColor = color(178, 34, 34);
    var beginnerX = width * 0.375;
    var beginnerY = height / 2;
    var buttonWidth = 150;
    var buttonHeight = 30;
    var beginnerSize = 25;
    var intermediateColor = color(60, 179, 113);
    var intermediateX = beginnerX;
    var intermediateY = beginnerY + buttonHeight + 20;
    var intermediateSize = 19;
    var extremeColor = color(30, 144, 255);
    var extremeX = beginnerX;
    var extremeY = intermediateY + buttonHeight + 20;
    var extremeSize = 28;

    // Define the You Lose screen information
    var youLoseX = 150;
    var youLoseY = 150;
    var playAgainX = 225;
    var playAgainY = 250;
    // Store the level to load if Play Again button is clicked
    var playAgainLevel;

    // Define the paddle's properties
    var paddleColor = color(255, 255, 255);
    var paddleY = height * 0.875;
    var paddleWidth = width * (7 / 60);
    var paddleHeight = height * 0.0375;

    // Define the ball's properties
    var ballR = width * 0.02;
    var ballX = width / 2;
    var ballY = paddleY - ballR;
    var ballColor = color(255, 255, 255);
    var ballSpeedX = 2;
    var ballSpeedY = -4;

    // Create the properties of the bricks
    var brickRows;
    var brickCols;
    var brickColor = [color(255, 0, 0), color(255,165,0), color(255, 255, 0), color(0, 255, 0), color(0, 0, 255), color(75, 0, 130)];
    var brickWidth;
    var brickHeight;
    var topOffset;

    // The Paddle object type with arguments y-position, width, height, and color
    var Paddle = function(y, w, h, c) {
      this.x = mouseX - w / 2;
      this.y = y;
      this.w = w;
      this.h = h;
      this.c = c;

      // Draw the paddle and update its x-coordinate based on the mouse position
      this.draw = function() {
        this.x = mouseX - this.w / 2;
        fill(this.c);
        rect(this.x, this.y, this.w, this.h);
      };
    };

    // The Ball object type
    var Ball = function(x, y, r, c, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.c = c;
      this.speedX = speedX;
      this.speedY = speedY;

      this.draw = function() {
        fill(this.c);
        this.x += this.speedX;
        this.y += this.speedY;
        ellipse(this.x, this.y, this.r, this.r);

        // Check for collisions
        this.paddleCollision();
        this.brickCollision();
        this.wallCollision();
      };

      // Check if the ball has collided with the paddle
      this.paddleCollision = function() {
        if(this.x >= paddle.x && this.x <= paddle.x + paddle.w && this.y >= paddle.y && this.y <= paddle.y + paddle.h) {
          // Randomize the ball's direction after it bounces off the paddle
          this.speedX = round(random(-6, 6));
          this.speedY *= -1;
        }
      };

      // Check if the ball has collided with the bricks
      this.brickCollision = function() {
        for(var i = 0; i < bricks.length; i++) {
          if((this.x + this.r >= bricks[i].x) && this.x - this.r <= (bricks[i].x + bricks[i].w) && this.y + this.r >= bricks[i].y && this.y - this.r <= (bricks[i].y + bricks[i].h)) {
            this.speedY *= -1;

            // Remove the brick from the array
            bricks.splice(i, 1);
            i--;

            // If there are no bricks left, the user wins
            if(bricks.length === 0)
              youWin(currentScene);

            // Exit the function
            return;
          }
        }
      };

      this.wallCollision = function() {
        if(this.x + this.r >= 600 || this.x - this.r <= 0)
          this.speedX *= -1;
        else if(this.y - this.r <= 0)
          this.speedY *= -1;
        // Check if the entire ball has gone off the bottom of the screen
        else if(this.y - this.r >= height)
          youLose(currentScene);
      };
    };

    // The Brick object type with arguments x-coordinate, y-coordinate, width, height, and color
    var Brick = function(x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.c = c;

      this.draw = function() {
        fill(this.c);
        rect(x, y, w, h);
      };
    };

    // Create a paddle
    var paddle = new Paddle(paddleY, paddleWidth, paddleHeight, paddleColor);

    // Create a ball
    var ball = new Ball(ballX, ballY, ballR, ballColor, ballSpeedX, ballSpeedY);

    // Create an array of bricks
    var bricks = [];

    // Construct the bricks
    var createBricks = function() {
      for(var i = 0; i < brickRows; i++) {
        for(var j = 0; j < brickCols; j++) {
          var x = brickWidth * j;
          var y = brickHeight * i + topOffset;
          var w = brickWidth;
          var h = brickHeight;
          var c = brickColor[i];

          bricks.push(new Brick(x, y, w, h, c));
        }
      }
    };

    // Draw the start screen
    var startScreen = function() {
      background(0, 0, 0);
      currentScene = 0;

      // Empty the array of bricks
      bricks.length = 0;

      // Draw the title "BreakoutJS"
      textSize(titleSize);
      text("BreakoutJS", titleX, titleY);

      // Draw the beginner level button
      fill(beginnerColor);
      rect(beginnerX, beginnerY, buttonWidth, buttonHeight);
      fill(255, 255, 255);
      textSize(beginnerSize);
      text("BEGINNER", beginnerX + 9, beginnerY + 25);

      // Draw the intermediate level button
      fill(intermediateColor);
      rect(intermediateX, intermediateY, buttonWidth, buttonHeight);
      fill(255, 255, 255);
      textSize(intermediateSize);
      text("INTERMEDIATE", intermediateX + 5, intermediateY + 23);

      // Draw the extreme level button
      fill(extremeColor);
      rect(extremeX, extremeY, buttonWidth, buttonHeight);
      fill(255, 255, 255);
      textSize(extremeSize);
      text("EXTREME", extremeX + 7, extremeY + 26);
    };

    // You Lose screen
    var youLose = function(level) {
      background(0, 0, 0);

      currentScene = 4;
      playAgainLevel = level;

      // Empty the array of bricks
      bricks.length = 0;

      // Draw the text "You Lose!"
      textSize(70);
      text("You Lose!", youLoseX, youLoseY);

      // Draw the Play Again button
      fill(178, 34, 34);
      rect(playAgainX, playAgainY, buttonWidth, buttonHeight);
      fill(255, 255, 255);
      textSize(25);
      text("PLAY AGAIN", playAgainX + 3, playAgainY + 25);
    };

    // You Win screen
    var youWin = function(level) {
      background(0, 0, 0);

      // Empty the array of bricks
      bricks.length = 0;

      // Draw the text "You Lose!"
      textSize(70);
      text("You Win!", youLoseX + 15, youLoseY);

      if(level === 1 || level === 2) {
        // Set the scene and store the next level to play
        currentScene = 5;
        nextLevel = level + 1;

        // Draw the Next Level button
        fill(60, 179, 113);
        rect(playAgainX, playAgainY, buttonWidth, buttonHeight);
        fill(255, 255, 255);
        textSize(24);
        text("NEXT LEVEL", playAgainX + 3, playAgainY + 25);
      }
      else if(level === 3) {
        // Set the current scene
        currentScene = 6;

        // Draw the Home button
        fill(30, 144, 255);
        rect(playAgainX, playAgainY, buttonWidth, buttonHeight);
        fill(255, 255, 255);
        textSize(28);
        text("HOME", playAgainX + 34, playAgainY + 25);
      }
    };

    // Set up the beginner level
    var setBeginner = function() {
      currentScene = 1;

      // Place the ball at the correct position
      ball.x = ballX;
      ball.y = ballY;
      ball.speedY = -4;

      // Define the brick properties
      brickRows = 5;
      brickCols = 8;
      brickWidth = width / brickCols;
      brickHeight = height / 20;
      topOffset = height / 8;

      createBricks();
    };

    // Set up the intermediate level
    var setIntermediate = function() {
      currentScene = 2;

      // Place the ball at the correct position
      ball.x = ballX;
      ball.y = ballY;
      ball.speedY = -6;

      // Define the brick properties
      brickRows = 5;
      brickCols = 10;
      brickWidth = width / brickCols;
      brickHeight = height / 20;
      topOffset = height / 8;

      createBricks();
    };

    // Set up the extreme level
    var setExtreme = function() {
      currentScene = 3;

      // Place the ball at the correct position
      ball.x = ballX;
      ball.y = ballY;
      ball.speedY = -8;

      // Define the brick properties
      brickRows = 6;
      brickCols = 10;
      brickWidth = width / brickCols;
      brickHeight = height / 20;
      topOffset = height / 8;

      createBricks();
    };

    var mouseClicked = function() {
      if(currentScene === 0) {
        if(mouseX >= beginnerX && mouseX <= beginnerX + buttonWidth && mouseY >= beginnerY && mouseY <= beginnerY + buttonHeight)
          setBeginner();
        else if(mouseX >= intermediateX && mouseX <= intermediateX + buttonWidth && mouseY >= intermediateY && mouseY <= intermediateY + buttonHeight)
          setIntermediate();
        else if(mouseX >= extremeX && mouseX <= extremeX + buttonWidth && mouseY >= extremeY && mouseY <= extremeY + buttonHeight)
          setExtreme();
      }
      else if(currentScene === 4) {
          if(mouseX >= playAgainX && mouseX <= playAgainX + buttonWidth && mouseY >= playAgainY && mouseY <= playAgainY + buttonHeight) {
            // Check which level the user just played and load that level
            if(playAgainLevel === 1)
              setBeginner();
            else if(playAgainLevel === 2)
              setIntermediate();
            else if(playAgainLevel === 3)
              setExtreme();
          }
      }
      else if(currentScene === 5) {
          if(mouseX >= playAgainX && mouseX <= playAgainX + buttonWidth && mouseY >= playAgainY && mouseY <= playAgainY + buttonHeight) {
            // Check which level the user just played and load that level
            if(nextLevel === 2)
              setIntermediate();
            else if(nextLevel === 3)
              setExtreme();
          }
      }
      else if(currentScene === 6) {
        if(mouseX >= playAgainX && mouseX <= playAgainX + buttonWidth && mouseY >= playAgainY && mouseY <= playAgainY + buttonHeight)
          startScreen();
      }
    };

    var draw = function() {
      if(1 <= currentScene && currentScene <= 3) {
        background(0, 0, 0);

        // Draw the paddle, ball, and bricks
        paddle.draw();
        ball.draw();
        for(brick in bricks) {
          bricks[brick].draw();
        }
      }
    };

    startScreen();
  }
};