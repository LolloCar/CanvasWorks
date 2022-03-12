const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');


const canvasSize = 1080;
let manager;

let image;

let text ='A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const circle = (context,centerX,centerY,radius) => {
  context.lineWidth =3;
  context.save();
  context.beginPath();
  context.arc(centerX,centerY,radius,0,Math.PI*2);
  context.stroke();
  context.fill(); 
  context.restore();
}

const settings = {
  dimensions: [ canvasSize, canvasSize ],
  animate : true,
  totalFrames : 25,
  fps : 10,
  loop:false,
  playbackRate : 'throttle'
};

	
const images = [];	

const sketch = async ({ context, width, height }) => {

  
  context.fillStyle = 'black';
  context.fillRect(0,0,width,height);
    
  const cols = 40;
  const rows = 40;
  const cellW = Math.floor(canvasSize/cols);
  const cellH = Math.floor(canvasSize/rows);
  const numOfCells = cols * rows;
  const circleRadius = 10;
  context.strokeStyle = 'white';
  context.strokeRect(0,0,cellW*cols,cellH*rows);
    
	//leggere total frames?

  return  ({ context, width, height,frame }) => {
	  
	
	image =images[frame+1];
	if (typeof image == 'undefined') return;
	console.log('frame = '+frame+',image = '+image.src);
	typeCanvas.width = width;
	typeCanvas.height = height;
	typeContext.drawImage(image,0,0,canvasSize,canvasSize);
  
    const typeData = typeContext.getImageData(0,0,canvasSize,canvasSize).data;
    context.fillStyle = 'white';
	context.fillRect(0,0,width,height);
    
    const circlez = []
	
    for (let j = 0; j<numOfCells; j++) {
		
		const x1 = j%cols;
		const y1 = Math.floor(j / rows);
		const x = cellW*x1
		const y = cellH*y1
		let index = x+canvasSize*y  ;
		const r = typeData[index*4 + 0];
		const g = typeData[index*4 + 1];
		const b = typeData[index*4 + 2];
		const a = typeData[index*4 + 3];
		context.fillStyle = 'black';//*/ `rgb(${r},${g},${b},${a})`
		
		  context.lineWidth =3;
		  context.save();
		  context.translate(cellW/2,cellH/2);
		  context.beginPath();
		  context.arc(x,y,math.mapRange(r,0,255,0,circleRadius),0,Math.PI*2);
		  if (r>100)
		  //context.stroke();
		  context.fill(); 
		  context.restore();
		

	}
  };
};




const getGlyph = (v) => {
  if (v< 50) return '';
  if (v<100) return random.pick(['.','\'']);
  if (v<150) return random.pick(['_','-']);
  if (v<200) return random.pick(['+','[',']','/']);
  const glyphs = '*=#/@'.split('');
  return random.pick(glyphs);
}

const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
}

//document.addEventListener('keyup',onKeyUp);

const url = 'frames/bubi0001.jpg';


const loadMeSomeImage = (url) => {
  return new Promise((resolve,reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;

  })
}


const start = async() => {
  for (let i = 1; i<25;	 i++) {
	  console.log('Loading '+'frames/bubi'+('000'+(i)).slice(-4)+'.jpg');
	  let img = await loadMeSomeImage('frames/bubi'+('000'+(i)).slice(-4)+'.jpg');
	  images.push(img);
	  
  }
  
  canvasSketch(sketch, settings);
};

start();