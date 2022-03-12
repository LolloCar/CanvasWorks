const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');

const width = 1080;
const height = 1080;

const settings = {
  dimensions: [ width, height ],
  animate:true,
  fps:60,
  duration:16
};

const numberOfSquares = 13;
const squareSize = 0.60*width/2;
const angleIncrease = Math.PI*2/numberOfSquares;
const sketch = () => {
  return ({ context, width, height,time }) => {
	//  context.globalCompositeOperation='source-over';
    //context.fillStyle = '#FFFFFF66';
	var radgrad = context.createRadialGradient(width/2, width/2, 60, width/2, width/2, width/2);
	/*radgrad.addColorStop(0, 'white');
	radgrad.addColorStop(0.9, 'yellow');
	radgrad.addColorStop(1, 'white');*/
	context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'red';
	context.translate(width/2,height/2);
	context.lineWidth='6';
	//context.globalCompositeOperation='destination-atop';
	context.strokeStyle='white';
	context.beginPath();	
	for (let j= 0;j<numberOfSquares;j++) {
		context.rotate(angleIncrease);
		context.save();
		
		context.translate(squareSize*Math.sqrt(2)/2,0);
		context.rotate(time*Math.PI/4);
		
		context.rect(-squareSize/2,-squareSize/2,squareSize,squareSize);
		context.arc(-squareSize/2,-squareSize/2,squareSize/4,0,Math.PI*2);
		context.restore();
	}
	const radius = squareSize*(1+Math.cos(time*2*Math.PI/settings.duration))/1.4;
	context.moveTo(radius,0);
	context.arc(0,0,radius,0,Math.PI*2);

	context.stroke();
	context.fill('evenodd');
  };
};

canvasSketch(sketch, settings);
