const canvasSketch = require('canvas-sketch');
const {klib} = require('../../kyobalib');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	//draw_mandala_leaf(context,100,100,800,800);
	context.strokeRect(100, 100, 800, 800);
	const l = new MandalaLeaf(new Point(100,100),800,800);
	l.draw(context);
  };
};

class Point {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
}

class MandalaLeaf {
  constructor(origin,height, width) {
	this.origin = origin;
    this.height = height;
    this.width = width;
  }
  
  draw (context) {
	let start = new Point(this.origin.x,this.origin.y+this.height);
	let cp1 =   { x: this.origin.x+this.width/4,   y: this.origin.y+this.height  };
	let cp2 =   { x: this.origin.x,   y: this.origin.y+this.height/4  };
	let end =   { x: this.origin.x+this.width/2,   y: this.origin.y };
	let reflectedCp2 = klib.reflectPointH([cp2.x,cp2.y],this.origin.X+this.width/2);
	//alert(reflectedCp2);
	let reflectedCp1 = klib.reflectPointH([cp1.x,cp1.y],this.origin.X+this.width/2);
	let trueEnd = { x: this.origin.x+this.width,y : this.origin.x+this.height }
	context.beginPath();
	context.moveTo(start.x, start.y);
	context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
	context.bezierCurveTo(reflectedCp2[0], reflectedCp2[1], reflectedCp1[0], reflectedCp1[1], trueEnd.x,trueEnd.y);
	context.stroke();

	// Start and end points
	context.fillStyle = 'blue';
	context.beginPath();
	context.arc(start.x, start.y, 5, 0, 2 * Math.PI);  // Start point
	context.arc(end.x, end.y, 5, 0, 2 * Math.PI);      // End point
	context.fill();

	// Control points
	context.fillStyle = 'red';
	context.beginPath();
	context.arc(cp1.x, cp1.y, 5, 0, 2 * Math.PI);  // Control point one
	context.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI);  // Control point two
	context.arc(reflectedCp2[0].x, reflectedCp2[1].y, 5, 0, 2 * Math.PI);  // Control point one
	context.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI);  // Control point two
	context.fill();
  }
  
}

canvasSketch(sketch, settings);
