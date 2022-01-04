const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math=require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080,1080 ],
  animate:true,
  //duration:4,
  fps:40
};

const ballrotationspeed =1;


const sketch = ({ context, width, height,frame }) => {
	
	const rows = 7;
	const columns = 7;
	
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
	  if (i>=rows*3 && i<rows*4) continue;
	  drawables.push(new Box(i,lattice[i],boxsize,math.degToRad(0),i>rows*3));
  }
	
  let t = 0; let ballposition = new Vector(0,0);
  return ({ context, width, height,time,frame }) => {
	 
	let ballrotation = -Math.PI/120*frame*ballrotationspeed;
	let ballrotationradius =  width/2 * 0.95;
	//  console.log(t,frame,new Date());
    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	drawables.forEach(drawable => {
		drawable.draw1(context);
	});
	drawables.forEach(drawable => {
		drawable.draw2(context);
	});
		
		
	context.save();
	ballposition.x = width/2+Math.cos(ballrotation)*ballrotationradius;
	ballposition.y = height/2+Math.sin(ballrotation*2)*ballrotationradius;
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
	
	getDistanceVector(v) {
		return new Vector(this.x-v.x,this.y-v.y);
	}
	
	getAngle(v) {
		const dx = v.x-this.x;
		const dy = v.y-this.y
		const sinus = dx/this.getDistance(v);
		return Math.acos(sinus)*math.sign(dy);
	}
	
	scalarProduct(n) {
		return new Vector(this.x*n,this.y*n);
	}
}

//rotation 0 = points up
class Box {
	
	constructor (id,position, size, rotation,polarity) {
		this.id = id;
		this.pos = position;
		this.offset = new Vector(0,0);
		this.size = size;
		this.rotation = 0;
		this.polarity = polarity?1:-1;
	}
	
	draw1(context) {
		context.save();
		context.translate(this.pos.x,this.pos.y);
		context.fillStyle = 'red'
		context.fillRect(-this.size*0.8/2,-this.size*0.8/2,this.size*0.8,this.size*0.8);
		context.restore();
		
	}
	draw2(context) {
		context.save();
		context.translate(this.pos.x,this.pos.y);
		context.translate(this.offset.x,this.offset.y);
		context.fillStyle = 'black'
		context.rotate(this.rotation);
		context.fillRect(-this.size/2,-this.size/2,this.size,this.size);
		context.restore();
		
	}
	
	update(ballposition,time,width) {
	
		
		let distance =  this.pos.getDistance(ballposition);
		let factor = width/distance;
		
		if (this.id == 0) console.log('t = '+distance);
		//let multiplier = math.lerp(0,0.3,width/(distance*10));
		//let multiplier = 2000/(distance*distance);
		let multiplier = math.clamp(30/(distance-5)-0.04,0,100);
		this.offset = this.pos.getDistanceVector(ballposition).scalarProduct(this.polarity*multiplier);
		this.rotation = this.polarity*math.mapRange(distance,width*0.8,0,0,Math.PI/10);
	}
}


const circle = (context,centerX,centerY,radius) => {
	context.save();
	context.beginPath();
	context.arc(centerX,centerY,radius,0,Math.PI*2);
	context.fill();
	context.restore();
}
