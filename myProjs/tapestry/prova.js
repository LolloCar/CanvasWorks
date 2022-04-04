const canvasSketch = require('canvas-sketch');
const {klib} = require('../../kyobalib');

const canvasSize = 1080;


const settings = {
  dimensions: [ canvasSize, canvasSize ]
};

const sketch = () => {
	
	
	
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.beginPath();
	seamSquare(context,200,200,7600,600,20);
	context.stroke();
	
  };
};


const seamSquare = (context,x,y,width,height,density) => {
	let nextPoint = klib.box_randomPointNearBoxBorder(x,y,width,height,width*0.05,0);
	context.moveTo(nextPoint[0],nextPoint[1]);
	for (let i = 0; i<density;i++) {
		 nextPoint = klib.box_randomPointNearBoxBorder(x,y,width,height,width*0.05,0);
		context.lineTo(nextPoint[0],nextPoint[1]);
	}
	
}

canvasSketch(sketch, settings);
