const canvasSketch = require('canvas-sketch');
const random  = require('canvas-sketch-util/random');
const math  = require('canvas-sketch-util/math');
const settings = {
  dimensions: [ 1080, 1080 ],
  animate:true,
  a : 'b'
};

const horizontalResolutionInPixels = 3;
const numOLines = 44;
const sinusHFactor = 1/20;
const basicAmplitude = 90;
const circleRadius = 300;
const noiseFrequency = 0.1;
const canvas2 = document.createElement('canvas');
const context2 = canvas2.getContext('2d');
const lineDistancing = settings.dimensions[1]/numOLines;
const sketch = (context) => {
  canvas2.width = settings.dimensions[0];
  canvas2.height = settings.dimensions[1];
  context.lineJoin = "round";
  return ({ context, width, height,time }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context2.fillStyle = 'white';
	context2.fillRect(0,0,width,height);
	let cx = xpos(time);
	let cy = ypos(time);
	const gradient = context2.createRadialGradient(cx, cy, 0, cx, cy, circleRadius);
	gradient.addColorStop(0, 'black');
	gradient.addColorStop(1, 'white');
	context2.fillStyle = gradient;
	context2.beginPath();
	context2.arc(cx,cy,circleRadius,0,2*Math.PI); 
	context2.fill();
	let v = 0;
	//disegno le righe spesse, primo ciclo
	context.lineWidth = 6;
	while (v<=settings.dimensions[1]+basicAmplitude) {
		context.beginPath();
		context.moveTo(0,v);
		context.lineTo(settings.dimensions[0],v);
		context.stroke();
		v = v+ lineDistancing;
	}
	//faccio il cerchio bianco
	context.fillStyle = 'grey';
	context.beginPath();
	context.arc(cx,cy,circleRadius,0,2*Math.PI); 
	context.fill();
	//disegno le righe ondulose
	v = 0;
	context.lineWidth = 2;
	context.strokeStyle = 'white';
	while (v<=settings.dimensions[1]+basicAmplitude) {
		//determino la frequenza della riga
		let frequency = sinFrequency(v);
		let o = 0;
		//disegno la linea spessa
		context.beginPath();
		context.moveTo(o,v);
		while (o<=settings.dimensions[0]) {
			o = o+horizontalResolutionInPixels;
			let amp = amplitude(o,v);
			context.lineTo(o,v+amp*Math.sin(o*frequency+sinOffset(v)+time));
		}
		context.stroke();
		v = v+ lineDistancing;
	}
	
  };
};

const sinOffset= (y)  => {
	return settings.dimensions[0]*(random.noise1D(y,noiseFrequency)+1)/2
}

const sinFrequency = (y) => {
	let frequency = random.noise1D(y+Math.sqrt(2),1,.2);
	console.log(frequency);
	return  frequency;
}

const xpos = (time) => {
	return ((random.noise1D(time,noiseFrequency)+1)/2)*settings.dimensions[0];
}
const ypos = (time) => {
	return ((random.noise1D(-time,noiseFrequency)+1)/2)*settings.dimensions[1];
}

const amplitude= (x,y) => {
	if (x <= 0 || y <0 || x >= settings.dimensions[0] || y >= settings.dimensions[1]) return 0;
	const color = context2.getImageData(x,y,1,1).data[0];
	return basicAmplitude*((255-color)/255);
}

const norm= (x) => { return (x+1)/2 }

canvasSketch(sketch, settings);
