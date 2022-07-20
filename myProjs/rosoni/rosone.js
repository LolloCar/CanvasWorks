const canvasSketch = require('canvas-sketch');
const {klib} = require('../../kyobalib');
const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const center = [settings.dimensions[0]/2,
				settings.dimensions[1]/2];

const n = 20;

const sketch = () => {
  return ({ context, width, height,time }) => {
    context.fillStyle = '#DDDDDD';
    context.fillRect(0, 0, width, height);
	context.translate(-200,200);

	context.fillStyle = '#333333CC';
	context.beginPath();
	context.moveTo(center[0],center[1]);
	context.translate(settings.dimensions[0]/2,
	settings.dimensions[1]/2);
	context.rotate(((2-time)*2/40)*Math.PI)
	context.translate(-settings.dimensions[0]/2,
	-settings.dimensions[1]/2);
	drawRose(context);
	context.stroke();
	context.fill('evenodd');
	context.fillStyle = '#AAAAAACC';
	context.beginPath();
	context.translate(settings.dimensions[0]/2,
	settings.dimensions[1]/2);
	context.scale(1+Math.sin(time)/10,1+Math.cos(time)/10);
	context.rotate(((2+time)*2/40)*Math.PI)
	context.translate(-settings.dimensions[0]/2,
	-settings.dimensions[1]/2);
	drawRose(context);
	context.stroke();
	context.fill('evenodd');

  };
};

const drawRose = (context) => {
	for (let i = 0; i<20; i++) {
		let target1 = klib.ptc(settings.dimensions[0]*1.8,(i+3)*2*Math.PI/n,center);
		let cp1 = klib.ptc(settings.dimensions[0]/2,(i-3)*2*Math.PI/n,center);
		let target2 = klib.ptc(settings.dimensions[0]*1.8,(i-3)*2*Math.PI/n,center);
		let cp2 =  klib.ptc(settings.dimensions[0]/2,(i+3)*2*Math.PI/n,center);
		context.moveTo(center[0],center[1]);
		
		context.quadraticCurveTo(cp1[0],cp1[1],target1[0],target1[1]);
		context.lineTo(target2[0],target2[1]);
		context.quadraticCurveTo(cp2[0],cp2[1],center[0],center[1]);
		/*context.quadraticCurveTo(cp2[0],cp2[1],center[0],center[1]);*/
		
	}
	
}

canvasSketch(sketch, settings);
