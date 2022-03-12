const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');
const settings = {
  dimensions: [ 1080, 1080 ],
  animate:true
};

const radius = 300;
const maxRadius =1000;
const distance = (angle) => {
	
	if (angle > 0 && angle<Math.PI) return radius;
	if (angle<0) angle = (Math.PI-angle)
	/*if (angle>Math.PI) */return  radius + radius * ((2*(angle-Math.PI)) **2) / 30//math.mapRange(angle-Math.PI,0,Math.PI,radius,maxRadius);
	if (angle<0) return 0;//radius + math.mapRange(angle-Math.PI,0,Math.PI,radius,maxRadius);
}

const drawPetal= (context) => {
	context.strokeRect(0,-10,50,20);
}

const sketch = () => {
	
  return ({ context, width, height,frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	
	const interval = Math.PI/30;
	context.fillStyle = 'black'

	for (let i = -Math.PI; i<(2*Math.PI);i += interval) {
		context.save();
		context.translate(width/2,height/2);
		context.rotate(i);
		context.translate(distance(i),0);
		drawPetal(context);
		context.restore();
	}

	
  };
};

canvasSketch(sketch, settings);
