const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const {klib} = require('../../kyobalib');
const Tweakpane = require ('tweakpane');

let text ='Yes!';
let fontFamily = 'tahoma';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');



const settings = {
  dimensions: [ 1200, 1200 ]
};


const params = {
	size : 19,
	it : 0.42,
	ot : 0.50,
	lineWidth : 2.1
}

const sketch = ({ context, width, height }) => {

  return ({ context, width, height }) => {
	context.shadowColor = '#555555';
	context.shadowOffsetX = 1;
	context.shadowOffsetY = 1;
	const cell = params.size;
	const cols = Math.floor(width/cell);
	const rows = Math.floor(height/cell);
	const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;
	typeContext.fillStyle = 'green';
    typeContext.fillRect(0, 0, cols, rows);
    fontSize = cols* 0.55;
    typeContext.fillStyle = 'white';
    typeContext.font = `${fontSize}px ${fontFamily}`;
	//alert(typeContext.font);
    typeContext.textBaseline = 'top';


    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * - 1;
    const my = metrics.actualBoundingBoxAscent * - 1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw)*0.5 -mx;
    const ty = (rows - mh)*0.5 -my;
    typeContext.save();
    typeContext.translate(tx,ty);
    typeContext.beginPath();
    typeContext.rect(mx,my,mw,mh);
    typeContext.stroke();
    typeContext.fillText(text,0,0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0,0,cols,rows).data;

    
    context.fillStyle = '#ffffe6';
    context.fillRect(0,0,width,height);
	//context.drawImage(typeCanvas,0,0);
	context.strokeStyle = 'red';
	
	
	for (let i = 0; i < numCells; i++) {
      const col = i%cols;
      const row = Math.floor(i/cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];
      //context.translate(random.range(-1,1),random.range(-1,1))
	  let density = Math.floor(r/4.5);
	  density = density * density / 200;
      if (density >0) {
		  
		  seamSquare(context,x,y,cell,cell,density);
		 
	  }
    }
	
  };
};

let lastPoint = null;
const seamSquare = (context,x,y,width,height,density) => {
	context.shadowBlur = 2;
	let nextPoint = klib.box_randomPointNearBoxBorder(x,y,width,height,width*params.it,width*params.ot);
	if (lastPoint != null) {
	context.beginPath();
	context.lineWidth = params.lineWidth/2;
	context.moveTo(lastPoint[0],lastPoint[1]);
	context.lineTo(nextPoint[0],nextPoint[1]);
	context.stroke();
	}
	context.lineWidth = params.lineWidth;
	context.shadowBlur = 0;
	context.beginPath();
	
	for (let i = 0; i<density;i++) {
		nextPoint = klib.box_randomPointNearBoxBorder(x,y,width,height,width*params.it,width*params.ot);
		context.lineTo(nextPoint[0],nextPoint[1]);
	}
	context.stroke();
	lastPoint = nextPoint;


	
}

let manager;

const start = () => {
  canvasSketch(sketch, settings).then(mgr => {manager = mgr;})
}

const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;
	folder = pane.addFolder({title:'Tapestry'});
	
	folder.addInput(params,'size', {min:2 , max:200, step:1});
	folder.addInput(params,'it', {min:0 , max:1, step:0.01});
	folder.addInput(params,'ot', {min:0 , max:1, step:0.01});
	folder.addInput(params,'lineWidth', {min:0 , max:5, step:0.1});
    pane.on('change', (ev) => {
		manager.render();
	});
}

createPane();


start();
