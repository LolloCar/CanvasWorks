const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const size = 1080;

const settings = {
  dimensions: [ size,size ]
};

//Variables

boxSize =  size * 0.2;

const sketch = ({ context, width, height }) => {
	
 
  const box_Distance = boxSize * 1.1; 
  

  let box1 = new Box(200,200,random.range(-Math.PI,Math.PI));
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	box1.draw(context);
  };
};

canvasSketch(sketch, settings);

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
	
	//var box_Side = 0;

	
	constructor (x,y,rotation,side) {
		this.x = x;
		this.y = y;
		this.rotation = rotation;
	}
	
	draw(context) {
		context.save();
		context.translate(this.x,this.y);
		context.rotate(this.rotation);
		context.fillRect(-boxSize/2,-boxSize/2,boxSize,boxSize);
		context.restore();
		
	}
}
