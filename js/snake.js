// Snake project JavaScript and jQuery
$(function() {
  // Definitions
  var grid$ = $( "#game-grid" );
  var newGame$ = $( "#button" );
  var points$ = $( '#points' );
  var div$ = $( "div" );
  var snake;

  // Create game board
  function createBoard() {
    var i;
    var j;

    // Clear grid
    grid$.html('');
    points$.text(0);

    for (i = 0; i < 40; i++) {
      for (j = 0; j < 40; j++) {
        createBox(12, i, j);
      }
    }

    grid$.append("<div class='clear-fix'></div>");
  }

  // Create boxes
  function createBox(size, y, x) {
    d = document.createElement( 'div' );
    $( d ).addClass('box');
    box$ = $( d );
    var s = size.toString() + 'px';

    // Adjust box properties
    box$.data('value', {x: x, y: y } );
    box$.attr('x', x);
    box$.attr('y', y);

    // Add newly created box to grid
    grid$.append(box$);
  }

  // Create snake constructor
  function Snake(x, y) {
    this.x = x;
    this.y = y;
    this.body = [];
    this.direction = "r";
    this.body.push([this.x, this.y]);
  }

  // Change direction of snake
  Snake.prototype.changeDirection = function(head) {
    var new_x;
    var new_y;

    // Determine how to change based on returned value from keydown handler
    switch(this.direction) {
      case 'u':
        new_x = head[0];
        new_y = head[1] - 1;
        break;
      case 'r':
        new_x = head[0] + 1;
        new_y = head[1];
        break;
      case 'l':
        new_x = head[0] - 1;
        new_y = head[1];
        break;
      case 'd':
        new_x = head[0];
        new_y = head[1] + 1;
        break;
    }

    return [new_x, new_y];
  }

  // Move to function
  Snake.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
    this.body.unshift([this.x, this.y]);
  }

  // Snake eating function
  Snake.prototype.eat = function() {
    if (food.x === this.x && food.y === this.y) {
      this.body.unshift([food.x, food.y]);
      createFood();
      points$.text(Number (points$.text()) + 1);
    }
  }

  // Snake self-collision checking function
  Snake.prototype.collide = function() {
    for (var c = 1; c < this.body.length; c++) {
      if (this.x === this.body[c][0] && this.y === this.body[c][1]) {
        return true;
      }
    }

    return false;
  }

  // Redraw the head of the snake
  function drawHead(x, y) {
    div$.find("[x=" + x + "]" + "[y=" + y + "]").addClass('snake head');
  }

  // Food constructor
  function Food() {
    this.x = Math.floor(Math.random() * 39);
    this.y = Math.floor(Math.random() * 39);
  }

  // Food creation function
  function createFood() {
    $( "div" ).removeClass('food');
    food = new Food();
    $( "div" ).find("[x=" + food.x +"]" + "[y=" + food.y + "]").addClass('food');
  }

  // Redraw the rest of the snake
  function drawBody(tail) {
    $( 'div.snake' ).each(function() {
      var xs = $( this ).data('value').x;
      var ys = $( this ).data('value').y;

      if (snake.x === xs && snake.y === ys) {
        // do nothing
      } else {
        $( this ).removeClass('head');
        $( this ).addClass('snake');
      }
    });

    // Remove the tail piece from the snake as it moves
    div$.find("[x=" + tail[0] + "]" + "[y=" + tail[1] + "]").removeClass('snake head');
  }

  // New game function
  function newGame() {
    points$.text('0');
    createBoard();
    snake = new Snake(20, 20);
    div$.find("[x=" + snake.x + "]" + "[y=" + snake.y + "]").addClass('snake');
    createFood();
    run();
  }

  // Run game function
  function run() {
    var head = [snake.x, snake.y];
    var newCoords = snake.changeDirection(head);
    var tail = snake.body.pop();

    snake.eat();
    snake.moveTo(newCoords[0], newCoords[1]);

    if (newCoords[0] < 0 || newCoords[0] > 39 || newCoords[1] < 0 || newCoords[1] > 39 || snake.collide()) {
      gameStop()
      message = "You have crashed. Game over";
      return;
    }

    drawHead(newCoords[0], newCoords[1]);
    drawBody(tail);

    // Set to repeat over and over
    setTimeout(function() { run() }, 100);
  }

  // Game end function
  function gameStop() {
    $( "div" ).removeClass("food snake head");
    points = 0;
  }

  // Keydown event handler
  $( document ).on('keydown', function(key) {
    switch(parseInt(key.which, 10)) { // Figure out which key was pressed

      // h (left) is pressed
      case 72:
        if (snake.direction !== 'r') {
          snake.direction = 'l';
          break;
      }

      // j (down) is pressed
      case 74:
        if (snake.direction !== 'u') {
          snake.direction = 'd';
          break;
      }

      // k (up) is pressed
      case 75:
        if (snake.direction !== 'd') {
          snake.direction = 'u';
          break;
      }

      // l (right) is pressed
      case 76:
        if (snake.direction !== 'l') {
          snake.direction = 'r';
          break;
      }
    }
  });

  // New game button functionality
  newGame$.click(function() {
    newGame();
  });

  // Initialize page load with a game board
  createBoard();
  newGame();
});
