const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');
const {klib} = require('../../kyobalib');

const canvasSize = 1200;

let image;

let typeData;

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d', { willReadFrequently: true });

/**
* Creo un array di @resolution punti intorno al cerchio (Pi*2)
* e poi ne prendo uno a caso
*/

const settings = {
  dimensions: [ canvasSize, canvasSize ]
};

const compensation = 0;

//Acceptable drawing distancce outside of frame
const tolerance = 20;
const size = 16;
const opacity =100//0- 255
const gradientDelta = 10;
const resolution = 280;

const sketch = ({ context, width, height }) => {
  typeCanvas.width = width;
  typeCanvas.height = height;
  typeContext.drawImage(image,0,0,canvasSize,canvasSize);
  typeData = typeContext.getImageData(0,0,canvasSize,canvasSize).data;

  typeContext.fillStyle = 'white';
  typeContext.strokeStyle = 'white';
  typeContext.lineWidth = 10;
  let color1  = '#000000'+((opacity-gradientDelta)<0?0:(opacity-gradientDelta)).toString(16);
 context.strokeStyle = color1;
  let arrayOfPoints = [];
  for (let j = 0; j<Math.PI*2; j += (Math.PI*2/resolution)) {
	  arrayOfPoints.push(klib.ptc(canvasSize/2,j,[canvasSize/2,canvasSize/2]));
  }
  
  return ({ context, width, height }) => {
	context.fillStyle = 'white';
	context.fillRect(0,0,width,height);
	console.time('elaboro')
  //Tentativi. Se trova bianco manco prova
    
	let j1=0,j2=0;
	j1 = random.rangeFloor(0,resolution);
	let x = 0;
	while ((x++)<1200) 
	//while (true)
	{
		
		
		let goodPoint = 0; let lastDarkness = 0;
		let j2 = 0; 
		let p1 = arrayOfPoints[j1];
		while (j2<resolution) 
		{
			
			let p2 = arrayOfPoints[j2];
			let d1 = getSegmentAvgDarkness(p1,p2,80);
			if (d1>lastDarkness) 
			{
				goodPoint = j2;
				lastDarkness = d1;
			}
			j2++;
		}
		//console.log('lastDarkness='+lastDarkness);
		if (lastDarkness == 0) {
			console.log("Quitting at "+x);
			break;
		}
		//console.log(j1,goodPoint);
		p2 = arrayOfPoints[goodPoint];
	
		//context.fillStyle=gradient;
		
		context.beginPath();
		context.moveTo(p1[0],p1[1]);
		context.lineTo(p2[0],p2[1]);
		context.stroke();
		typeContext.beginPath();
		typeContext.moveTo(p1[0],p1[1]);
		typeContext.lineTo(p2[0],p2[1]);
		typeContext.stroke();
		typeData = typeContext.getImageData(0,0,canvasSize,canvasSize).data;
		j1 = goodPoint;
	}
		
  
  
  console.timeEnd('elaboro');
  //context.drawImage(typeCanvas,0,0);
  }   
};

//const url = 'gradient.png';
//const url = 'lincoln1.jpg';
const url = 'marylin.jpg';
//const url = 'shape.png';

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

//returns a 0 - 255 value for the greyscale (0 - white 255 - black)
const getDarknessAtXY = (x,y) => {
		
		if (x<0||x>canvasSize) return 0;
		if (y<0||y>canvasSize) return 0;
		
		let index = x+canvasSize*y  ;
		
		const r = typeData[index*4 + 0];
		return (255-r);
}


//gets the average greyscake (0-255) for the triangle border
const getSegmentAvgDarkness=(p1,p2,resolution) => {
	let darkness = 0;
	//distance between p1 and p2
	const distance = klib.pointsDistance(p1,p2);
	for (let i = 0; i<distance; i = i+(distance/resolution)) {
		//samples all the points in the segment and calculates the sum of "darkness"
		rp = klib.respatiatePoint(p1,p2,i,null);
		darkness += getDarknessAtXY(Math.floor(rp[0]),Math.floor(rp[1]));
	}
	return darkness/(resolution);
}

const maxDepth=100;


