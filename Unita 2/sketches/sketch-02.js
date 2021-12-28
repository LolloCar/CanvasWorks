const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const thicknessThreshold = 15;


const settings = {
	dimensions: [ 1080, 1080 ]
	,animate: true
};

let time = 0;
let maxOffset = 0;

const sketch = ({ context, width, height }) => {
	
	const numArcs = 40;
	const numBoxes = 60;
	maxOffset = width*0.4;
	const arcs = [];
	const boxes = [];
	for (let i = 0; i<numArcs; i++) {
		arcs.push(new Arc(width * 0.2,width * 0.5,20,50));
	}
	
	const boxLength = width*0.6;
	
	for (let i = 0; i<numBoxes; i++) {
		boxes.push(new Box(boxLength,
						   height * 0.005,
						   (i*360/numBoxes)
						  ));
	}
	
	return ({ context, width, height }) => {
		time++;
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
		context.fillStyle = 'black';
		
		//context.arc(width*0.5,height*0.5,200,0,7);
		//context.stroke();

		const cx = width  * 0.5;
		const cy = height * 0.5;

		const w = width  * 0.01;
		const h = height * 0.1;
		let x, y;

		arcs.forEach(arc => {
			arc.draw(context,cx,cy);
			arc.update();
		});
		for (let x = 0;x<boxes.length; x++) {
			let nextIndex = x+1;
			if (nextIndex == (boxes.length)) nextIndex = 0;
			boxes[x].update(boxes[nextIndex]);
			boxes[x].draw(context,cx,cy);
			
		};
		
	};
};	

const offsetSpeed = 3;

class Box {
	constructor(w,h,angle) {
		
		this.w = w;
		this.h = random.range(h/2,h/3);
		this.angle = angle;
		this.offsetX = 200;
		
	}
	
	draw(context,centerX,centerY,angle) {
			context.save();
			/*if (this.angle ==0) {
			context.fillStyle = 'red';
			}else {
				context.fillStyle = 'black'
			}*/
			context.translate(centerX, centerY);
			context.fillStyle =this.color;
			context.rotate(math.degToRad(this.angle+time/100000));
			context.beginPath();
			context.rect(this.offsetX, -this.h * 0.5, this.w, this.h*2);
			context.fill();
			context.moveTo(0,0);
			context.lineTo(this.offsetX,this.h * 0.5);
			//context.stroke();
			context.restore();
			
		}
	update(other) {
		let t = ((time)+this.angle/3.6)%100;
		if (t<80) { 
		 this.color = 'black';
			this.offsetX = 200
			}
		else {
			this.offsetX = 150+150*Math.sin((time+this.angle)/10);
			this.color = 'red';
		}
		
			
		
		
		
		
	}
	}


class Arc {
	constructor(minRadius,maxRadius,minArcDegrees,maxArcDegrees) {
		this.radius = random.range(minRadius,maxRadius);
		//larghezza arco in radianti
		this.arcSize = random.range(math.degToRad(minArcDegrees),math.degToRad(maxArcDegrees));
		this.angle= random.range(0,Math.PI*2);
		this.maxRotationSpeed = random.range(-200,200)/60;
		this.rotationSpeed = this.maxRotationSpeed;
		
		this.thickness = random.range(1, 50);
		this.bouncyness = 40;// random.range(10,20);		
		this.bouncynessDelay = random.range(0,1000)
		this.bouncynessAmp = random.range(0.1,2);
		
	}
	
	draw(context,centerX,centerY) {
		context.save();
		context.translate(centerX,centerY);
		context.rotate(this.angle);
		context.lineWidth = this.thickness;
		context.beginPath();
		context.arc(0, 0, this.radius, 0,this.arcSize);
		context.stroke();
		context.restore();
	}
	
	update(context) {
		
		let chance = 0.08;
		if (Math.random()>(1-chance/100)) {
			this.angle = random.range(0,Math.PI*2);
			this.radius *=random.range(0.9,1.1);
			this.speed *=-1;
		}
		if (this.thickness > thicknessThreshold) {
			this.rotationSpeed = this.maxRotationSpeed * Math.cos((this.bouncynessAmp+time+this.bouncynessDelay)/this.bouncyness);
		}
		//this.radius = math.mapRange(Math.sin((time/20)%360),-1,1,200,600);
		this.angle = this.angle + math.degToRad(this.rotationSpeed);
	}
}

canvasSketch(sketch, settings);
