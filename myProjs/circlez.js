const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const Tweakpane = require ('tweakpane');
const size = 1080;

const settings = {
  dimensions: [ size, size ],
  //animate:true,
  fps:40,
  playbackRate:'throttle'
};
const params = {

	animate:false

}

const n_i = 50; //number of iterations
const factor = 0.75;

let baseAngle =math.degToRad(100);

const sketch = () => {
	
  let angleIncrease = 0;
  const circleSizeFactor = 268 / (factor/0.75);
  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
	context.strokeStyle = 'black';
	context.fillStyle = 'white';
	angleIncrease += math.degToRad(1); 
	
	if ((baseAngle+angleIncrease)*factor >= baseAngle) {
		//Il secondo cerchio sta nella posizione del primo
		angleIncrease = 0;
	}
	
	if (!params.animate) {
		angleIncrease = 0;
	}
	firstCircleAngle = baseAngle+angleIncrease;
	
	//una delle poche cose che va bene
	let circleRadius = circleSizeFactor * (firstCircleAngle/math.degToRad(100));
	let circles = [];
	for (let i = 0; i<n_i; i++) {
		const multiplier = Math.pow(factor,i);
		let angle = firstCircleAngle * multiplier+Math.PI/2;
		
		x = size+Math.cos(angle)*size;
		y = 0+Math.sin(angle)*size;
		//console.log(x,y);
		//A 90 vale 240
		//A 100 vale 268
		//A 110 vale 296
		circles.push(new Circle(x,y,circleRadius*multiplier));
	}
	circles.forEach(item => item.draw(context));
	//	drawCircle(context,x,y,(circleRadius*multiplier));
	
  };
};




class Circle {
	constructor(x,y,radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		
	}
	
	getDistance(v) {
		const dx = this.x-v.x;
		const dy = this.y-v.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	
	draw (context,thickness){
	if (typeof thickness == 'undefined') thickness = 4;
	context.save();
	context.translate(this.x,this.y);
	context.beginPath();
	context.arc(0,0,this.radius,0,Math.PI*2);
	
	context.fill();
	context.lineWidth = thickness;
	context.stroke();
	
	context.restore();

}	

}

canvasSketch(sketch, settings);

const createPane = () => {
	const pane = new Tweakpane.Pane();
	pane.addInput(params,'animate');

}

createPane();
