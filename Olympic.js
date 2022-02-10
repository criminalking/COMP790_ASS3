function Olympic(context,x,y,sz,ss,rs)
{
    this.size = sz || 0.5;
    this.posX = x || 300;
    this.posY = y || 200;
	this.propScaleSpeed = ss || 0.01; //how fast the rings will scale
    this.frontScaleSize = 1; //scale rings start at
    this.propRotationSpeed = rs || 0.2; //how fast the rings will rotate
    this.frontPropAngle = 0; //rotate rings start at
    this.context = context;
	this.velocityX = Math.random()*2 - 1;
	this.velocityY = Math.random()*2 - 1;
	this.heading = Math.atan2(this.velocityX, -this.velocityY); //negative y since positive y is down
}

Olympic.prototype.drawRing = function(r, lineWidth, stroke) {
    this.context.save();
    this.context.scale(this.frontScaleSize, this.frontScaleSize);  
    this.context.rotate(this.frontPropAngle);
  
    this.context.beginPath();
    this.context.arc(0, 0, r, 1, 2 * Math.PI, false); // (0,0) in each coordinate
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
  
    //console.log(this.frontScaleSize + "\n");
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



