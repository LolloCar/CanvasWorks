const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');


const canvasSize = 1080;

let image;

let typeData;

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const settings = {
  dimensions: [ canvasSize, canvasSize ]
};


const sketch = ({ context, width, height }) => {
  typeCanvas.width = width;
  typeCanvas.height = height;
  typeContext.drawImage(image,0,0,canvasSize,canvasSize);
  typeData = typeContext.getImageData(0,0,canvasSize,canvasSize).data;
  
  return ({ context, width, height }) => {
    
  for (var i = 0; i<30800; i++) {
	  
	x = random.rangeFloor(0,canvasSize+1);  
	y = random.rangeFloor(0,canvasSize+1);  
	bright = getBrightnessAtXY(x,y);
	context.save();
	context.beginPath();
	context.arc(x, y, bright/100, 0,Math.PI*2	);
	context.stroke();
	context.restore();
	  
	}
  }
};


const url = 'gradient.png';

const loadMeSomeImage = (url) => {
  return new Promise((resolve,reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;

  })
}

const start = async() => {
  image = await loadMeSomeImage(url);
  console.log(image);
  canvasSketch(sketch, settings);
};

start();

//------------------------------------------

const getBrightnessAtXY = (x,y) => {
		let index = x+canvasSize*y  ;
		const r = typeData[index*4 + 0];
		const g = typeData[index*4 + 1];
		const b = typeData[index*4 + 2];
		const a = typeData[index*4 + 3];
		avg = Math.floor((r+g+b)/3);
		return (255-r);
}