const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
	dimensions: [ 1000, 1000 ],
	animate:false
};

let t = 0;

const sketch = ({ context, width, height }) => {
	
	
	
	return ({ context, width, height }) => {
		t++;
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
		context.fillStyle = 'black';
		
		const cx = width  * 0.5;
		const cy = height * 0.5;
		
		context.strokeRect(0,0,cx/2,cx/2);
		//Dichiaro i punti
		let p = new Vector(cx/4,0);
		let o = new Vector(0,0);
		
		drawArc(context,p.x,p.y,10,360,'black');
		context.lineWidth  = 5;
		//context.translate(-.75*cx,-.75*cx);
		context.save();
		
		let rotation =Math.PI/4;
		v2 = vectorBy(p,o,rotation);
		context.translate(-p.x,-p.y);
		//context.strokeStyle = 'red';
		//context.strokeRect(0,0,cx/2,cx/2);
		context.rotate(rotation);
		context.strokeStyle = 'blue';
		//alert(p.y*Math.cos(rotation));
		context.translate(p.x*Math.cos(rotation)+p.y*Math.sin(rotation),
		-p.x*Math.sin(+rotation)+p.y*Math.cos(-rotation))
		
		drawArc(context,v2.x,v2.y,30,360,'black');
		//console.log(v2.x,v2.y);
		//drawArc(context,.75*cx,.75*cx,100,360,'black');
		//context.translate(-v2.x,-v2.y);
		//context.strokeRect(cx/2,cx/2,cx/2,cy/2);
		context.strokeRect(0,0,cx/2,cx/2);
		
	 /*   drawArc(context,0,0,cx,90,0,'black');
		drawArc(context,0,0,cx,90,10,'green');
		drawArc(context,0,0,cx,90,45,'blue');
		drawArc(context,0,0,cx,90,90,'grey');*/
		
		/*context.fillRect(1.5*cx,1.5*cx,cx/2,cy/2);*/
	}
		
};

function vectorBy(vector,centre,rotation) {
	//tation = math.degToRad(rotation);
	let a = centre.x;
	let b = centre.y;
	return new Vector((vector.x-a)*Math.cos(rotation) + (vector.y-b)*Math.sin(rotation)+a,
	   -(vector.x-a)*Math.sin(rotation)+(vector.y-b)*Math.cos(rotation)+b);
		
}

const drawArc = (context,centerX,centerY,radius,arc,rotation,color) => {
	let rotationRad = math.degToRad(rotation);
	let arcRad = math.degToRad(arc);
	
	context.save();
	context.strokeStyle = color;
	//context.rotate(rotationRad);
	//context.translate(radius*Math.sin(arcRad/2)-Math.sin(arcRad/2-rotationRad)*radius,radius*Math.cos(arcRad/2)-radius*Math.cos(rotationRad)*radius);
	//draw bonding box

	
	context.beginPath();
	context.arc(centerX,centerY,radius,0,arcRad);
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
