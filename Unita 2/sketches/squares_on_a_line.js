const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
	  
	let pi = Math.PI;
	let p2 = pi* 2;
	const hp = Math.pow(height,2);
	function drawRectangleAt(x,y,size,rotation) {
		context.save();
		context.translate(x,height-y);
		context.rotate(rotation);
		context.beginPath();
		context.rect(-size/2,-size/2,size,size);
		
		context.stroke();
		context.restore();
		
	}
	
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	
	context.strokeStyle = 'red';
	
	context.beginPath();
	context.arc(0, 0, width, 0, pi/2);
	context.stroke();
	
	context.strokeStyle = 'black';
	steps = 20;
	
	for (j = 0; j<=steps; j++) {
		x = (width/steps) *j;
		sqabs = Math.pow(x,2);
		//console.log(' _abs = '+_abs+', _abs^2 = '+sqabs+', height = '+height+', height ^ 2 = '+hp);
		y = height - Math.sqrt(hp  - sqabs);
		
		derivative = - (x / (Math.sqrt(hp-sqabs)));
		console.log(derivative);
		
		drawRectangleAt(x,y,30,Math.atan(derivative));	
	}
	
	
  };
};

canvasSketch(sketch, settings);
