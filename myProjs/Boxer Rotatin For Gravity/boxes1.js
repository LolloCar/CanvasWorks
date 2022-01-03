const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math=require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080,1080 ],
  animate:true,
  //duration:4,
  fps:40
};

const ballrotationspeed =1.5;


const sketch = ({ context, width, height,frame }) => {
	
	const rows = 8;
	const columns = 8;
	
	const relativesize = 0.6;
	
	const gridw = width * relativesize;
	const gridh = height * relativesize;
	
	const cellw = gridw/rows;
	const cellh = gridh/columns;
	
	const marginl = (width - gridw)/2;
	const margint = (height - gridh) / 2;
  //Distance between boxes (NOT the mortar!)
  const boxsize =cellw * 0.8; 
  let lattice = makeLattice(rows,columns,cellw);

  //center the lattice
  translateVectorArray(lattice,marginl+cellw/2,margint+cellh/2);
  
  let drawables = [];
  for (let i = 0; i<rows*columns; i++) {
	  drawables.push(new Box(i,lattice[i],boxsize,math.degToRad(0),true,true));//random.range(-Math.PI,Math.PI)));
  }
	
  let t = 0; let ballposition = new Vector(0,0);
  return ({ context, width, height,time,frame }) => {
	 
	let ballrotation = -Math.PI/120*frame*ballrotationspeed;
	let ballrotationradius =  width/2 * 0.95;
	//  console.log(t,frame,new Date());
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	drawables.forEach(drawable => {drawable.draw(context)});
		
		
	context.save();
	ballposition.x = width/2+Math.cos(ballrotation)*ballrotationradius;
	ballposition.y = height/2+Math.sin(ballrotation)*ballrotationradius;
	circle(context,ballposition.x,ballposition.y,10);
	context.restore();
	drawables.forEach(drawable => {drawable.update(ballposition,time,width);});
  };
};

canvasSketch(sketch, settings);
/*
* Creates a lattice of vectors, its top left centered on origin
*/
function makeLattice(rows,columns,gap)
{
	let lattice = [];
	for (let i =0; i < columns; i++) 
	{ for (let j = 0; j < rows; j++) 
		{
			lattice.push(new Vector(i*gap,j*gap));
		}
	}
	return lattice;
}	

function translateVectorArray(array,x,y) 
{
	array.forEach(item => {item.x += x, item.y += y});
}

class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		
	}
	
	getDistance(v) {
		const dx = this.x-v.x;
		const dy = this.y-v.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	
	getAngle(v) {
		const dx = v.x-this.x;
		const dy = v.y-this.y
		const sinus = dx/this.getDistance(v);
		return Math.acos(sinus)*math.sign(dy);
	}
}

//rotation 0 = points up
class Box {
	
	constructor (id,position, size, rotation,hasSpring,ballAttracted) {
		this.id = id;
		this.pos = position;
		this.rotation = rotation;
		this.rotationalAcceleration = 0;
		this.rotationalSpeed = 0;
		this.size = size;
		this.hasSpring = hasSpring;
		this.ballAttracted = ballAttracted;
	}
	
	draw(context) {
		context.save();
		context.translate(this.pos.x,this.pos.y);
		context.rotate(this.rotation);
		context.fillRect(-this.size/2,-this.size/2,this.size,this.size);
		context.fillStyle='red';
		//circle(context,this.size/4,0,5);
		context.restore();
		
	}
	
	update(ballposition,time,width) {
		
		let distance =  this.pos.getDistance(ballposition);
		let angle = this.pos.getAngle(ballposition)-this.rotation;
		if (this.id == 4) console.log('angle = '+angle);
		if (angle > Math.PI) {
			angle = (Math.PI*2 - angle);
		} 
		//Simulate the fact that the square will tend to present
		//its closer side to the ball attraction
		if (angle > Math.PI/4 && angle<Math.PI*3/4) {
			angle -= Math.PI/2 
		} else if (angle>Math.PI*3/4) {
			angle -= Math.PI
		} else if (angle < -Math.PI/4 && angle>-Math.PI*3/4) {
			angle += Math.PI/2
		} else if (angle<Math.PI*3/4) {
			angle += Math.PI
		}
		const springHardness = .015;
		const frictionK = .055;
		const ballPull = 800;
		
		/*if (Math.abs(this.rotationalSpeed)<0.001 && Math.abs(this.rotation)<Math.PI/90) {
			
			this.rotation = 0; 
		}*/
		let spring = this.rotation * springHardness;
		
		let rotatinBallForce = ballPull*angle/(distance*distance);
		let friction =  this.rotationalSpeed*frictionK;
		
		if (distance>width/2) rotatinBallForce *= 0.2;
		
		this.rotationalAcceleration = -(this.hasSpring?spring:0) -friction + (this.ballAttracted?rotatinBallForce:0);
		
		if (this.id == 4) {
			console.log('Spring = '+this.rotation * springHardness+', ball force = '+ballPull*angle/(distance*distance)+' rotation  = '+math.radToDeg(this.rotation)+', ball angle = '+math.radToDeg(this.pos.getAngle(ballposition))+', dx = '+(ballposition.x-this.pos.x)+' distance = '+this.pos.getDistance(ballposition)+' cosine = '+(ballposition.x-this.pos.x)/this.pos.getDistance(ballposition));
			
		}
		

		this.rotation += this.rotationalSpeed;
		
		
		//if (this.rotation>0) console.log('rotationalAcceleration = '+this.rotationalAcceleration);
		if (Math.abs(this.rotationalAcceleration) < 0.00001) {
			this.rotationalAcceleration = 0;
		}
		this.rotationalSpeed += this.rotationalAcceleration;	
	}
}



const circle = (context,centerX,centerY,radius) => {
	context.save();
	context.beginPath();
	context.arc(centerX,centerY,radius,0,Math.PI*2);
	context.fill();
	context.restore();
}
