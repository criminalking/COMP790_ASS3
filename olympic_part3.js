//A list of keys that are currently pressed down
var keysdown = {};

//Event listener for when the user presses a key
window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  
  keysdown[event.key] = true;

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window

//Event listener for when the user releases a key
window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  
  keysdown[event.key] = false;

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window

window.onload = function() { 
  //Variables representing the canvas and the canvas' context (the context is used for actually drawing on the canvas)
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  //The olympic symbols that we will be drawing on the canvas
  var symbol = new Olympic(context);
  //symbols.push(new Olympic(context, 100, 100, 1, 0.02));
  
  var text = ""; // text displayed
  var grade = 0; // grade of player 
  var total_turn = -1; // number of turns

  //start drawing the first frame
  requestAnimationFrame(mainLoop);

  //Game Loop
  function mainLoop() {
    processInput();
    update();
    draw();
    requestAnimationFrame(mainLoop); //keep reiterating through this loop
  }
  
  function processInput()
  {
    if(keysdown[" "]) { 
        var current_turn = parseInt((symbol.frontPropAngle) / (2*Math.PI));
        if (current_turn > total_turn) { // a new turn
          if (Math.abs(current_turn * 2*Math.PI - symbol.frontPropAngle) <= 5 * symbol.propRotationSpeed) { // click when the circle points directly down
            grade += 100; 
            console.log("Score: " + grade);
            text = "You got " + grade + " points!";             
          }
          total_turn = current_turn;
        }
        else {
          text = "You got " + grade + " points!";
        }
	}
    text = "You got " + grade + " points!";
  }

  function update() {
    symbol.update();
    //console.log(symbol.frontPropAngle);
    //symbols.forEach(function(c) { c.update();})
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18px Courier New';
    context.fillStyle = 'black';
    context.fillText('Try to click space when the ring is facing down,', 20, 20);
    context.fillText('only one click is allowed per turn!', 20, 40);

    if(text !== "") {
      context.font = 'bold 18px Courier New';
      context.fillStyle = 'blue';
      context.fillText(text, 20, 60);
    }
    symbol.draw();
    //symbols.forEach(function(c) { c.draw(); })
  }

function Olympic(context,x,y,sz,ss,rs)
{
    this.size = sz || 0.5;
    this.posX = x || 300;
    this.posY = y || 200;
	this.propScaleSpeed = ss || 0.01; //how fast the rings will scale
    this.frontScaleSize = 1; //scale rings start at
    this.propRotationSpeed = rs || 0.05; //how fast the rings will rotate
    this.frontPropAngle = 0; //rotate rings start at
    this.context = context;
	this.velocityX = Math.random()*2 - 1;
	this.velocityY = Math.random()*2 - 1;
	//this.heading = Math.atan2(this.velocityX, -this.velocityY); //negative y since positive y is down
}

Olympic.prototype.drawRing = function(r, lineWidth, stroke) {
    this.context.save(); 
    this.context.scale(this.frontScaleSize, this.frontScaleSize);
    this.context.rotate(this.frontPropAngle);

    this.context.beginPath();     
    this.context.arc(0, 0, r, 3, 2 * Math.PI, false); // (0,0) in each coordinate
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = stroke; 
    this.context.stroke();

    this.context.restore();  
};

Olympic.prototype.draw = function() {
    this.context.save();

    this.context.translate(this.posX, this.posY);
    this.context.rotate(this.heading);
    this.context.scale(this.size, this.size);

    this.context.save();
    const colors = ["#006BB0", "#1D1815", "#DC2F1F", "#EFA90D", "#059341"];
    // relative translation distance
    const xs = [0, 60, 60, -90, 60];
    const ys = [0, 0, 0, 30, 0];

    // draw the whole olympic ring
    for(var i = 0; i < 5; ++i)
	{
        this.context.translate(xs[i], ys[i]);
		this.drawRing(25, 5, colors[i]);
	}
    this.context.restore();

	this.context.restore();
}

Olympic.prototype.update = function() {
    this.frontScaleSize += this.propScaleSpeed;
    if (this.frontScaleSize <= 0.5)
      {
        this.frontScaleSize = 0.5;
        this.propScaleSpeed *= -1;
      }
    if (this.frontScaleSize >= 3)
      {
        this.frontScaleSize = 3.0;
        this.propScaleSpeed *= -1;
      }

    this.frontPropAngle += this.propRotationSpeed;

	this.posX += this.velocityX;
	this.posY += this.velocityY;

	if (this.posX < 0)
	{
		this.posX = 0;
		this.velocityX *= -1;
	}
	if (this.posX > this.context.canvas.clientWidth)
	{
		this.posX = this.context.canvas.clientWidth;
		this.velocityX *= -1;
	}
	if (this.posY < 0)
	{
		this.posY = 0;
		this.velocityY *= -1;
	}
	if (this.posY > this.context.canvas.clientHeight)
	{
		this.posY = this.context.canvas.clientHeight;
		this.velocityY *= -1;
	}
}
}
