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
  dimensions: [ canvasSize, canvasSize ]
};



const sketch = ({ context, width, height }) => {

  
  typeCanvas.width = width;
  typeCanvas.height = height;
  typeContext.drawImage(image,0,0,canvasSize,canvasSize);
  context.fillStyle = 'black';
  context.fillRect(0,0,width,height);
    
  const cols = 120
  const rows = 120
  const cellW = Math.floor(canvasSize/cols);
  const cellH = Math.floor(canvasSize/rows);
  const numOfCells = cols * rows;
  const circleRadius = 10;
  context.strokeStyle = 'white';
  context.strokeRect(0,0,cellW*cols,cellH*rows);
  const noise = 5;
  return ({ context, width, height }) => {
    const typeData = typeContext.getImageData(0,0,canvasSize,canvasSize).data;
    
    
    const circlez = []
    for (let j = 0; j<numOfCells; j++) {
		
		const x1 = j%cols;
		const y1 = Math.floor(j / rows);
		const x = cellW*x1+random.rangeFloor(-noise,noise);
		const y = cellH*y1+random.rangeFloor(-noise,noise);;
		let index = x+canvasSize*y  ;
		const r = typeData[index*4 + 0];
		const g = typeData[index*4 + 1];
		const b = typeData[index*4 + 2];
		const a = typeData[index*4 + 3];
		context.strokeStyle =  `rgb(${r},${g},${b},${a})`;
		//console.log('x='+x+',y='+y+',i = '+i+' =>'+context.strokeStyle);
		circle(context,x,y,circleRadius+random.range(-5,5),true);
		

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

const url = 'girl.jpg';

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