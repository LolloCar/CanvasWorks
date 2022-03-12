const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math=require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080,1080 ],
  animate:true,
  //duration:4,
  fps:40
};

const ballrotationspeed =2;


const sketch = ({ context, width, height,frame }) => {
	
	const rowsPerBlock = 3;
	const columnsPerBlock = 4;

	//size of the grid (width- the height depends on number of rowsPerBlock)
	const relativesize = 0.4;

	const gridw = width * relativesize;

	const cellw = gridw/columnsPerBlock;
	const cellh = cellw;

	const marginl = (width/2 - columnsPerBlock*cellw)/3;
	const margint = (height - rowsPerBlock*cellh) / 2;
	console.log('Width:' +width+',gridw:' + gridw+',cellw: '+cellw+', margint: '+margint);
	
	//Distance between boxes (NOT the mortar!)
	const boxsize =cellw * 0.8; 

	let lattice = makeLattice(rowsPerBlock,columnsPerBlock,cellw);
	let lattice2 =  cloneVectorArray(lattice);
	lattice2.forEach( item => item.z = -1);
	translateVectorArray(lattice,marginl+cellw/2,margint+cellh/2);
	translateVectorArray(lattice2,width-marginl-columnsPerBlock*cellw,margint+cellh/2);
	let lattice3 =  cloneVectorArray(lattice);
	let lattice4 =  cloneVectorArray(lattice2);
	translateVectorArray(lattice3,0,-height/3);
	translateVectorArray(lattice4,0,-height/3)
	let lattice5 =  cloneVectorArray(lattice);
	let lattice6 =  cloneVectorArray(lattice2);
	translateVectorArray(lattice5,0,height/3);
	translateVectorArray(lattice6,0,height/3)
	lattice.push(...lattice2);
	lattice.push(...lattice3);
	lattice.push(...lattice4);
	lattice.push(...lattice5);
	lattice.push(...lattice6);
	console.log('Elements = '+lattice.length);
	let drawables = [];
	for (let i = 0; i<lattice.length; i++) {
	drawables.push(new Box(i,lattice[i],boxsize,math.degToRad(0)));
	}
	
  let t = 0; let ballposition = new Vector(0,0);
  return ({ context, width, height,time,frame }) => {
	
	
	let ballrotation = -Math.PI/120*frame*ballrotationspeed;
	let ballrotationradius =  width/2 * 0.95;
    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);
	// context.translate(width/2,height/2);
	// context.rotate(frame/100);
	// context.translate(-width/2,-height/2);
	context.fillStyle = 'black';
	drawables.forEach(drawable => {
		drawable.draw1(context);
	});
	drawables.forEach(drawable => {
		drawable.draw2(context);
	});
		
		
	context.save();
	ballposition.x = width/2+Math.cos(ballrotation)*ballrotationradius;
	ballposition.y = height/2+Math.sin(ballrotation*2)*0.5*ballrotationradius;
	context.fillStyle = 'white';
	circle(context,ballposition.x,ballposition.y,10);
	context.restore();
	drawables.forEach(drawable => {drawable.update(ballposition,time,width);});
  };
};

canvasSketch(sketch, settings);
/*
* Creates a lattice of vectors, its top left centered on origin
*/
function makeLattice(rowsPerBlock,columnsPerBlock,gap)
{
	let lattice = [];
	for (let i =0; i < columnsPerBlock; i++) 
	{ for (let j = 0; j < rowsPerBlock; j++) 
		{
			lattice.push(new Vector(i*gap,j*gap,1));
		}
	}
	return lattice;
}	

function cloneVectorArray(array) {
	let newArray = [];
	array.forEach(item => { newArray.push(new Vector(item.x,item.y,item.z)) })
	return newArray;
}

function translateVectorArray(array,x,y) 
{
	array.forEach(item => {item.x += x, item.y += y});
}

class Vector {
	constructor(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z; //used for up and down
		
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
	
	constructor (id,position, size, rotation) {
		this.id = id;
		this.pos = position;
		this.offset = new Vector(0,0);
		this.size = size;
		this.rotation = 0;
		this.polarity = 1;
		//this.polarity = position.z;
	}
	
	draw1(context) {
		context.save();
		context.translate(this.pos.x,this.pos.y);
		//context.translate(-this.offset.x,-this.offset.y);
		context.fillStyle = '#EEEEDD'
		context.fillRect(-this.size*0.8/2,-this.size*0.8/2,this.size*0.8,this.size*0.8);
		context.restore();
		
	}
	draw2(context) {
		context.save();
		context.translate(this.pos.x,this.pos.y);
		context.translate(this.offset.x,this.offset.y);
		context.fillStyle = 'black'
		context.rotate(this.rotation);
		context.scale(math.mapRange(this.rotation,0,Math.PI/10,1,0.6),1);
		context.fillRect(-this.size/2,-this.size/2,this.size,this.size);
		context.restore();
		
	}
	
	update(ballposition,time,width) {
	
		
		let distance =  this.pos.getDistance(ballposition);
		let factor = width/distance;
		
		if (this.id == 0) console.log('t = '+distance);
		//let multiplier = math.lerp(0,0.5,width/(distance*10));
		//let multiplier = 2000/(distance*distance);
		let multiplier = math.clamp(40/(distance-5)-0.04,0,400);
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
