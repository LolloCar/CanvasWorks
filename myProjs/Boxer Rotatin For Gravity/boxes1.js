const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math=require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080,1080 ],
  animate:true,
  duraton:2
};



const sketch = ({ context, width, height }) => {
	
  //Variables
  Box.size =  width * 0.2;
 
  //Distance between boxes (NOT the mortar!)
  const gap = Box.size  * 1.6; 
  const lattice_side = 2;
  let lattice = makeLattice(lattice_side,lattice_side,gap);
  latticeSize = gap * (lattice_side-1) + Box.size;
  console.log('Box.size = '+Box.size+',gap='+gap+' latticeSize = '+latticeSize);
  //center the lattice
  translateVectorArray(lattice,(width-latticeSize)/2+Box.size/2,(width-latticeSize)/2+Box.size/2);
  
  let box1 = new Box(lattice[0],random.range(-Math.PI,Math.PI));
  let box2 = new Box(lattice[1],random.range(-Math.PI,Math.PI));
  let box3 = new Box(lattice[2],random.range(-Math.PI,Math.PI));
  let box4 = new Box(lattice[3],0);
  let drawables = [box1,box2,box3,box4];
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	drawables.forEach(drawable => {drawable.draw(context);
		drawable.update();})

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
}

//rotation 0 = points up
class Box {
	static size = 0;
	constructor (position, rotation) {
		this.pos = position;
		this.rotation = rotation;
		this.rotationalAcceleration = 0;
		this.rotationalSpeed = 0;
	}
	
	draw(context) {
		context.save();
		context.translate(this.pos.x,this.pos.y);
		context.rotate(this.rotation-Math.PI/2);
		context.fillRect(-Box.size/2,-Box.size/2,Box.size,Box.size);
		context.fillStyle='red';
		circle(context,Box.size/4,0,5);
		context.restore();
		
	}
	
	update() {
		
		const springHardness = .015;
		const frictionK = .055;
		if (Math.abs(this.rotationalSpeed)<0.001 && Math.abs(this.rotation)<Math.PI/90) {
			console.log('Artifical stop');
			this.rotation = 0; return;
		}
		let spring = Math.abs(this.rotation * springHardness);
		if (this.rotation >0)console.log('Spring = '+spring);
		let friction =  Math.abs(this.rotationalSpeed*frictionK);
		this.rotationalAcceleration =elaborateAcc(spring,friction,math.sign(this.rotation),math.sign(this.rotationalSpeed),this.rotation)
		this.rotation += this.rotationalSpeed;
		
		
		if (this.rotation>0) console.log('rotationalAcceleration = '+this.rotationalAcceleration);
		if (Math.abs(this.rotationalAcceleration) < 0.00001) {
			this.rotationalAcceleration = 0;
		}
		this.rotationalSpeed += this.rotationalAcceleration;	
	}
}

function elaborateAcc(spring,friction,sign,speedSign,position) {
	return spring*sign*-1 + friction*speedSign*-1;
	
}

const circle = (context,centerX,centerY,radius) => {
	context.save();
	context.beginPath();
	context.arc(centerX,centerY,radius,0,Math.PI*2);
	context.fill();
	context.restore();
}
