const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const settings = {
  dimensions: [ 2048, 2048 ],
  animate:true
};

const sketch = ({ context, width, height }) => {
  
  const boxPerSide = 5;
  const boxSize = width*0.15;
  const gap = boxSize*0.05;
  
  let topDistance = (width - boxSize*boxPerSide - gap*(boxPerSide-1)) /2
  let bouncersX = [];
  let bouncersY = [];
  for (let x = 0; x < boxPerSide*boxPerSide; x++) {
	bouncersX.push(new Bouncer(0,30,1,x));
	bouncersY.push(new Bouncer(0,30,1,x));
  }
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	for (let i = 0; i<5; i++) {
		for (let j = 0; j<5; j++) {
			context.fillRect(topDistance+i*(boxSize+gap)+bouncersX[j*5+i].value,topDistance+j*(boxSize+gap)+bouncersY[j*5+i].value,boxSize,boxSize);
		}
	}
	bouncersX.forEach( bouncer => bouncer.update());
	bouncersY.forEach( bouncer => bouncer.update());
	
  };
};

class Bouncer {
	
	constructor(min,max,speed,type) {
		console.log('Bouncer between '+min+' and '+max);
		this.min = min;
		this.max = max;
		this.counter = random.range(min,max);
		this.value = this.counter;
		this.speed = speed;
		this.type = type;
	}
	
	update() {
		 if (this.type%3==1) {
		this.counter += this.speed;
		this.value = math.pingPong(this.counter,this.max);
		 } else if (this.type%3==2) {
		this.counter += this.speed;
		this.value = math.lerp(this.counter,this.min,this.max);
		 }  else {
			 this.value = 0;
		 }
	}

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



canvasSketch(sketch, settings);