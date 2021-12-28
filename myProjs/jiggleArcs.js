const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
	dimensions: [ 1080, 1080 ],
	animate:true
};

const sketch = ({ context, width, height }) => {
	
	const r1 = random.range(0.1, 2);
	const r2 = random.range(0.2, 0.5);

    const num = 40;
	
	var lw = new Array(num);
	var rr1 = new Array(num);
	var rr2 = new Array(num);
	var rr3 = new Array(num);
	var bouncerX = new Array(num);
	var bouncerY = new Array(num);
	var bouncerTh = new Array(num);
	
	const thSpeed = 2;
	
	for (let x = 0; x<lw.length;x++) 
	{
		lw[x] = random.range(5, 20);
		rr1[x] = random.range(0.7, 1.3);
		rr2[x] = random.range(1, -8);
		rr3[x] = random.range(1, 5);
		bouncerX[x] = new Bouncer(-0.01*width,0.01*width, random.range(-3,3));
		bouncerY[x] = new Bouncer(1,40, random.range(-3,3));
		bouncerTh[x] = new Bouncer(-30,30, random.range(-thSpeed,thSpeed));
	}
	
	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		context.fillStyle = 'black';

		const radius = width * 0.3;
		const cx = width  * 0.5;
		const cy = height * 0.5;

		const w = width  * 0.01;
		const h = height * 0.1;
		let x, y;


		for (let i = 0; i < num; i++) {
			const slice = math.degToRad(360 / num);
			const angle = slice * i;

			x = cx + radius * Math.sin(angle);
			y = cy + radius * Math.cos(angle);

			context.save();
			context.translate(cx, cy);
			context.rotate(-angle);
			//more interesting if I use only one bouncer
            context.translate(bouncerX[i].value,bouncerX[i].value);
			if (i%2==1) context.rotate(math.degToRad(bouncerTh[i].value));
			context.lineWidth = bouncerY[i].value;
			context.beginPath();
			context.arc(0, 0, radius * rr1[i], slice * rr2[i], slice * rr3[i]);	
			context.stroke();
			context.restore();
			bouncerX[i].update();
			bouncerY[i].update();
			bouncerTh[i].update();
		}
	};
};

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
