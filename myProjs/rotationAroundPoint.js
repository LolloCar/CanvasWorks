const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
	dimensions: [ 1080, 1080 ],
	animate:true
};

let t = 0;

const sketch = ({ context, width, height }) => {
	
	
	
	const cx = width  * 0.5;
	const cy = height * 0.5;
	const boxSide = cx*6/5;
	//Dichiaro il centro di rotazione
	let p = new Vector(cx,cy);
	
	//Dichiaro l'origine del Rectangle
	let a = new Vector(cx/4,cx/4);
	
	return ({ context, width, height }) => {
	
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
		context.lineWidth  = 5;
		context.strokeStyle = 'black';
		context.lineWidth  = 5;
		//drawing center of rotation
		circle(context,p.x,p.y,10);
		
		//Main animation
		let rotation =t/20;
		rotateAroundVector(context,p,rotation);
		context.strokeStyle = 'blue';
		context.strokeRect(a.x,a.y,boxSide,boxSide);
		context.beginPath();
		context.moveTo(a.x,a.y);
		context.lineTo(a.x+boxSide,a.y+boxSide);
		context.stroke();
		t++;

	}
		
};

function rotateAroundVector(context,vector,rotation) {
	context.translate(vector.x,vector.y);
	context.rotate(rotation);
	context.translate(-vector.x,-vector.y);
}


const circle = (context,centerX,centerY,radius) => {
		
	context.save();
	context.beginPath();
	context.arc(centerX,centerY,radius,0,Math.PI*2);
	context.stroke();
	context.restore();
}
class Vector {
	constructor(x,y,radius) {
		this.x = x;
		this.y = y;
		
	}
	
	getDistance(v) {
		const dx = this.x-v.x;
		const dy = this.y-v.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
}

class Bouncer {
	
	constructor(min,max,speed) {
		console.log('Bouncer between '+min+' and '+max);
		this.min = min;
		this.max = max;
		this.value = random.range(min,max);
		this.speed = speed;
	}
	
	update() {
		this.value += this.speed;
		if (this.value>=this.max) {
			this.value = this.max;
			this.speed *= -1;
		}
		if (this.value<=this.min) {
			this.value = this.min;
			this.speed *= -1;
		}
	}

}

canvasSketch(sketch, settings);
