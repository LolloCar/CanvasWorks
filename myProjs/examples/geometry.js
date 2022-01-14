const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const geometry  = require('canvas-sketch-util/geometry');
const {klib} = require('../../kyobalib');
const settings = {
  dimensions: [ 1000, 1000 ]
};


const params = {
	cols:5,
	rows:5,
	scaleMin : 1,
	scaleMax: 30
};


/*********************************
 * 
 * Experiments with line clipping and other shit
 * *******************************/



/****
 * FUNCTIONS
 *****/

const circle = (context,centerX,centerY,radius,fill) => {
  context.save();
  context.beginPath();
  context.arc(centerX,centerY,radius,0,Math.PI*2);
  if (fill) context.fill(); else context.stroke();
  context.restore();
}

const drawLines = (context,lines) => {
  //If I got an array of points, consider it as a single line
  if (!(lines[0][0].constructor === Array)) {
    lines = [lines];
  }

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
}
/**********
* MAIN
* ***********/

const sketch = ({width, height}) => {

	const box = [width/4,height/4,width*0.75,height*0.75];

	const cols = params.cols;
	const rows = params.rows;
	const numCells = cols * rows;

	const gridw = width;
	const gridh = height;
	const cellw = gridw / cols;
	const cellh = gridh / rows;
	const margx = (width - gridw) / 2;
	const margy = (height - gridh) / 2;
	return ({ context, width, height,frame,time,deltaTime }) => {

		context.fillStyle = 'black';
	for (let i =0; i<numCells; i++) {
		const col = i % cols;
		const row = Math.floor(i/cols);
		const x = col * cellw;
		const y = row * cellh;
		const w = cellw*0.9;
		const h = cellh*0.9;


		context.save();
		context.translate(margx,margy);
		context.translate(x,y);
		//circle(context,0,0,5,true);
		context.translate(cellw*0.5, cellh*0.5);
		//circle(context,0,0,30,true);
		context.strokeRect(-w/2,-h/2,w,h);
		const randomTriangle = klib.randomTriangle(-w/2,-h/2,w,h,0);
		drawLines(context,randomTriangle);
		context.restore();
	}

	}
  
};

canvasSketch(sketch, settings);
