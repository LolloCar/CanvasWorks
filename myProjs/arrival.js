const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const settings = {
  dimensions: [ 2000, 2000]
};

const arcResolution = 1000;
const radResolution = 2;
const initialRadius = 450;
const finalRadius = (settings.dimensions[0]/2)*0.9;
const arcPiece = 2*Math.PI / arcResolution;
const sketch = () => {
	

  return ({ context, width, height }) => {
	  
	
	context.fillStyle = 'red';
    context.fillRect(0, 0, width, height);
	context.lineCap='round';
	context.lineWidth=3;
	
	for (let i=0;i<width;i=i+20){
	context.beginPath();
	context.moveTo(i,height);
	context.lineTo(i,(height-i));
	context.stroke();
	}
	
	context.beginPath();
	context.arc(width/2,height/2,finalRadius,0,2*Math.PI);
	context.fill();
	
	context.lineWidth=3;
	for (let i = initialRadius; i<finalRadius;i=i+radResolution) {
		
		//console.log(arcPiece);
		for (let j = 0; j<2*Math.PI;j = j + arcPiece) {
			let x=j/(2*Math.PI);
			x = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
			if ((random.value()+x)<1) {
			context.save();
			context.translate(width/2,height/2);
			context.rotate(random.noise1D(i,1,0.01));
			context.translate(-width/2,-height/2);
			context.beginPath();
			context.arc(width/2,height/2,i,j,j+arcPiece);
			context.stroke();
			context.restore();
			}
		}
	}
	for (let i = 0; i<initialRadius;i=i+radResolution) {
		
		//console.log(arcPiece);
		for (let j = 0; j<2*Math.PI;j = j + arcPiece) {
			let x=j/(2*Math.PI);
			//x = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
			if ((random.value()+x)<1) {
			context.save();
			context.translate(width/2,height/2);
			context.rotate(random.noise1D(i,1,0.01));
			context.translate(-width/2,-height/2);
			context.beginPath();
			context.arc(width/2,height/2,i,-j,-j-arcPiece,true);
			context.stroke();
			context.restore();
			}
		}
	}

	
  };
};

canvasSketch(sketch, settings);
