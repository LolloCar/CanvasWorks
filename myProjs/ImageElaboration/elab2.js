const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');
const {klib} = require('../../kyobalib');

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
  typeContext.fillStyle = 'white';
  return ({ context, width, height }) => {
  console.time('elaboro')
  //Tentativi. Se trova bianco manco prova
  
  //Può anche esere un sistema per alleggerire
  //l'elaborazione
  for (let i = 0; i<200;i++) {
	const p = [random.rangeFloor(0,canvasSize+1),random.rangeFloor(0,canvasSize+1)];
	if (getDarknessAtXY(p[0],p[1])>0)
	{
		console.log('Render : '+p[0]+','+p[1]);
		renderPoint(p,context,typeContext,0);
	} else {
		console.log('Already rendered : '+p[0]+','+p[1]);
	}
  }
  
  console.timeEnd('elaboro');
   //context.drawImage(typeCanvas,0,0);
  }   
};

const url = 'lincoln1.jpg';

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
const getNoR = (darkness) =>  {
	//return (Math.floor((darkness) / 15))+1;
	return (Math.floor((darkness) / 5))+1;
	//return 15;
}

const getRadius = (darkness) =>  {
	//return (255-b)*0.5;
	//return 16;
	return 20;
}
const getDarknessAtXY = (x,y) => {
		let index = x+canvasSize*y  ;
		const r = typeData[index*4 + 0];
		return (255-r);
}

const maxDepth=100;

const renderPoint = (p,context,typeContext,depth) => {
	depth++;
	//if (depth>maxDepth) return;
	b = getDarknessAtXY(p[0],p[1]);
	if (b == 0) {
			return;
	}
	if (p[0]<0 || p[0]>canvasSize) return;
	if (p[1]<0 || p[1]>canvasSize) return;
	const rays = getNoR(b); //number of rays 
	const r = getRadius(b); //radius
	//Faccio un cerchio bianco per non insistere più su questo pezzo
	typeContext.beginPath;
	typeContext.arc(p[0],p[1],r/2,0,Math.PI*2);
	typeContext.fill();
	typeContext.closePath();
	//Aggiorno il typeData
	typeData = typeContext.getImageData(0,0,canvasSize,canvasSize).data;
  
	const newPoints = new Array();
	//disegno le righe
	for (let i = 0; i<rays; i++) {
		const np = klib.ptc(r,random.range(0,Math.PI*2),p);
		np[0] = Math.floor(np[0]);
		np[1] = Math.floor(np[1]);
		newPoints.push(np);
		context.beginPath();
		context.moveTo(p[0],p[1]);
		context.lineTo(np[0],np[1]);
		context.stroke();
	}
    newPoints.forEach( np => renderPoint(np,context,typeContext,depth));	
	
	
	

}
