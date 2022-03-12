const canvasSketch = require('canvas-sketch');
const {math,random,color} = require('canvas-sketch-util');
const {klib} = require('../kyobalib');

const settings = {
  dimensions: [ 1080,1080 ]
};

const trilobiteStep = 1080/180;

const noise = (x,y,average) => {
  return average+random.noise2D(x,y,0.002,average * 0.2);
}

const drawTrilobyte = (context,x,y,trilobiteLength,trilobiteRadius) => {
  //console.log('Draw trilobite, radius = '+trilobiteRadius);
  let startAngle=math.degToRad(random.range(0,120));
  
  let r_n = (x,y) => {
    let rad = trilobiteRadius+(random.noise2D(x+1,y+1,0.005,trilobiteRadius*1.5))/2;
    return rad;
  }
  let a_n = (angle,x,y) => {
    let randomAngle = angle+random.noise2D(x,y,0.0025,math.degToRad(24));
    //console.log(`Requested: random.noise2D(${x},${y},0.001,math.degToRad(14)) = `+randomAngle);

    return randomAngle;
  }

  for (let i = 0;Math.abs(i)<Math.abs(trilobiteLength);i+=(trilobiteStep*math.sign(trilobiteLength))) {
   // console.log(i);
    context.save();
	context.globalCompositeOperation = 'darken';
    context.translate(x,y);
    angle1 = a_n(startAngle,i,300);
    angle2 = angle1+math.degToRad(150);
    angle3 = angle1+math.degToRad(210);
    //I draw the triangle as a 'circle'
    context.translate(i,0);
    context.beginPath();
    context.moveTo(r_n(i,0)*Math.sin(angle1),r_n(i,0)*Math.cos(angle1));
    context.lineTo(r_n(i,1000)*Math.sin(angle2),r_n(i,1000)*Math.cos(angle2));
    context.lineTo(r_n(i,2000)*Math.sin(angle3),r_n(i,2000)*Math.cos(angle3));
    context.closePath();
    context.fillStyle='white';
    context.fill();
    context.stroke();
    context.restore();
    
  }

}
const drawLines = (context,lines,color) => {
	context.save();
	//If I got an array of points, consider it as a single line
	if (!(lines[0][0].constructor === Array)) {
		lines = [lines];
	}
	context.fillStyle=color.hex;
	console.log(color);
	for (let j = 0;j < lines.length; j++){
		const line = lines[j];
		context.beginPath();
		context.moveTo(line[0][0],line[0][1]);
		for (let i = 1; i<line.length;i++) {
			context.lineTo(line[i][0],line[i][1]);
		}
		context.closePath();
		context.fill();
	}
	context.restore();
}
const circle = (context,centerX,centerY,radius,fill) => {
  context.save();
  context.beginPath();
  context.arc(centerX,centerY,radius,0,Math.PI*2);
  if (fill) context.fill(); else context.stroke();
  context.restore();
}

const otherCanvas = document.createElement('canvas');
const otherContext = otherCanvas.getContext('2d');


const sketch = ({width, height }) => {
  //random.permuteNoise();
  otherCanvas.width = width;
  otherCanvas.height = height;
  otherContext.clearRect(0,0,width,height);
  
  const numOfBackgroundTriangles = 400;
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';


    let radius = width/15;
	
	for (let i = 0;i<numOfBackgroundTriangles;i++) {
		
		let rt = klib.randomTriangle(random.range(-width/10,width*0.9),random.range(-height/10,height*0.9),
				width/5,
				height/5, 0);
		drawLines(context,rt,color.blend('white','black',random.range(0,0.05)));
		
	}
	
    const triangle = klib.randomTriangle(width/2,width/2,width/2,width/2,20);
    //drawLines(context,triangle);
    drawTrilobyte(otherContext,width/2,height/10,-width,radius);
	drawTrilobyte(otherContext,width/2,height/4,width,radius);
    drawTrilobyte(otherContext,width/2,height*0.40,-width,radius);
    drawTrilobyte(otherContext,width/2,height*0.6,width,radius);
    drawTrilobyte(otherContext,width/2,height*0.8,width,radius*1.5);
	context.shadowColor = "black";
	context.shadowBlur = 40;
	context.shadowOffsetX = 6;
	context.shadowOffsetY = 6;
	context.drawImage(otherCanvas,0,0);
	
    
    
  };
};

canvasSketch(sketch, settings);
