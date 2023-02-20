const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');
const {klib} = require('../../kyobalib');

const canvasSize = 1200;

let image;

let typeData;

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const settings = {
  dimensions: [ canvasSize, canvasSize ]
};

const compensation = 0;
const numberOfShapes = 70000;
//Acceptable drawing distancce outside of frame
const tolerance = 20;
const size = 16
const opacity =90//0- 255
const gradientDelta = 10;
const resolution = 10;
const sketch = ({ context, width, height }) => {
  typeCanvas.width = width;
  typeCanvas.height = height;
  typeContext.drawImage(image,0,0,canvasSize,canvasSize);
  typeData = typeContext.getImageData(0,0,canvasSize,canvasSize).data;
  typeContext.fillStyle = 'white';
    
  let color1  = '#000000'+((opacity-gradientDelta)<0?0:(opacity-gradientDelta)).toString(16);
  let color2  = '#000000'+((opacity+gradientDelta)>255?255:(opacity+gradientDelta)).toString(16);
  if (color1.length == 8) color1 = color1.substring(0,7)+'0'+color1.substr(7,1);
  if (color2.length == 8) color2 = color2.substring(0,7)+'0'+color2.substr(7,1) ;
  //alert(color1+','+color2);
  return ({ context, width, height }) => {
	  context.fillStyle = 'white';
	  context.fillRect(0,0,width,height);
  console.time('elaboro')
  //Tentativi. Se trova bianco manco prova
  
  
  
  for (let i = 0; i<numberOfShapes;i++) {
	

	let p1 = [random.range(-tolerance,width+tolerance),random.range(-tolerance,width+tolerance)];
	let p2 = [p1[0]+random.range(-0,size),p1[1]+random.range(-0,size)];
	//let p3 = [p1[0]+random.range(-size,size),p1[1]+random.range(size,-size)];
	//let p2 = [p1[0]+random.range(-0,size),p1[1]+random.range(-0,size)];
	let p3 = [p1[0]+random.range(-0,size),p1[1]+random.range(0,-size)];
	let d1 = getSegmentAvgDarkness(p1,p2,resolution);
	let d2 = getSegmentAvgDarkness(p2,p3,resolution);
	let d3 = getSegmentAvgDarkness(p3,p1,resolution);
	const avgd = (d1+d2+d3) /3 ;
	const chance = math.clamp01((avgd + compensation)/255);
	//console.log('Triangle '+i+', average darkness = '+avgd+',chance = '+chance);
	if (!random.chance(chance*chance)) continue;
	
	let gradient = context.createLinearGradient(p1[0],p1[1],p2[0],p2[1]);
	gradient.addColorStop(0,color1);
	gradient.addColorStop(1,color2);
	context.fillStyle=gradient;
	context.strokeStyle = color2;
	context.beginPath();
	context.moveTo(p1[0],p1[1]);
	context.lineTo(p2[0],p2[1]);
	context.lineTo(p3[0],p3[1]);
	
	context.closePath();
	//context.fill();
	context.stroke();
  }
  
  console.timeEnd('elaboro');
   //context.drawImage(typeCanvas,0,0);
  }   
};

//const url = 'gradient.png';
//const url = 'lincoln1.jpg';
const url = 'marylin.jpg';

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


