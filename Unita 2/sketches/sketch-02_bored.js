const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};
const degToRad = (degrees) => { return degrees/180 * Math.PI}


const sketch = () => {
  return ({ context, width, height }) => {
	  
	const drawCircle = (x,y,radius) => {
		context.beginPath();
		context.arc(x,y,radius,0,Math.PI*2);
		context.stroke();
	}
	
	const drawRedDot = (x,y) => {
		context.save();
		context.fillStyle = 'red';
		context.strokeStyle = 'red';
		drawCircle(x,y,10);
		context.fill();
		context.restore();
	}
	
	const drawSquare = (x,y,side,full) => {
		context.beginPath();
		context.rect(x,y,side,side);
		if (full) {
			context.fillStyle='black';
			context.fill();
		}
		else {
			context.fillStyle='white';
			context.lineWidth  = width * 0.003;
			context.stroke();
			context.fill();
		}
		
	}
	
	
    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	context.strokeStyle = 'black';
	
	//drawRedDot(width/2,0);
	//drawRedDot(width/2,30);
	
	const side = width * 0.03;
	
	
	
	const steps = 30;
	const steps2= 10;
	let angle;
	let compression = width /4;
	context.rotate(degToRad(10));
	for (let i = 0; i <= steps ; i++) {
		for (let j = 0 ; j <= steps2; j++){
			compression = (width /2.2 ) * (j/steps2);
			angle = degToRad(i * (360/steps));
			context.save();
			context.translate(width/2 + Math.sin(angle) * compression ,height * (i/steps));
			context.rotate(-Math.cos(angle));
			if (Math.random()>0.85) {
				drawRedDot(0+compression,0);
			} else {
				drawSquare(-side/2,-side/2,side,Math.random()	>0.7);
			}
			//drawRedDot(0,0);
			context.restore();
		}
	}

	
	
  };
};

canvasSketch(sketch, settings);
