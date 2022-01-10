const canvasSketch = require('canvas-sketch');
const math=require('canvas-sketch-util/math');
const random  = require('canvas-sketch-util/random');


const canvasSize = 1080;
const settings = {
  dimensions: [ canvasSize, canvasSize ],
  animate:true,
  duration:3,
  fps:30
  
  
};

//https://gist.github.com/gre/1650294 easeInOutQuad
let ease = (t) => { return t<.5 ? 2*t*t : -1+(4-2*t)*t};

const easeType = 2; //1 - ease the playhead 2 - my ease


function getDistance(x,y,a,b) {
		const dx = x-a;
		const dy = y-b;
		return Math.sqrt(dx*dx + dy*dy);
	}

function drawMoon(context,x,y,progress,offset) {
	
	let color1,color2;
	offset = 3*getDistance(x,y,canvasSize/2,canvasSize/2)/canvasSize + math.mapRange(Math.atan2(x-canvasSize/2,y-canvasSize/2),-Math.PI,Math.PI,0,16);
	//console.log('progress='+progress);
	
	

	progress = (2*progress + offset)%2;
	if (progress < 0)
	{
		console.log('mavafangulo');
	}
	//console.log(offset,(progress+offset)%1);
	
	if (progress<1) {
		color1 = 'white';
		color2 = 'black';
	} else {
		color1 = 'black';
		color2 = 'white';
		
	}
	context.save();
	context.translate(x,y);
	context.fillRect(0,0,20,20);
	let num = 15;
	let rad = 14;
	
	context.lineWidth = 10;
	context.fillStyle = color1;
	context.beginPath();
	//context.moveTo(width/2,height/2);
	for (let i = 0; i<num; i++) {
		
		 let theta = (i/num) * 2*Math.PI;
		 let xx = rad * Math.cos(theta);
		 let yy = rad * Math.sin(theta);
		 //console.log(rad,theta,i,num,(i/num) );
		 context.lineTo(xx,yy);
	}
	
	context.closePath();
	context.fill();
	
	//second cicrlce
	context.fillStyle = color2;
	context.beginPath();
	
	//from -1 to 1 twice
	if (easeType == 1){
		phase = math.wrap(progress,0,1)*2-1
	}
	else if (easeType == 2) {
		phase = ease(math.wrap(progress,0,1))*2-1
	}		
		
	//console.log('Progress = '+progress+',phase = '+phase);
	for (let i = 0; i<num; i++) {
		
		 let theta = (i/num) * 2*Math.PI;
		 let xx = rad * Math.sin(theta);
		 let yy = rad * Math.cos(theta);
		 if (theta>Math.PI) xx *=  phase;
		 
		 
		 
		 context.lineTo(xx,yy);
	}
	
	context.closePath();
	context.fill();
	context.restore();
}


const sketch = ({width}) => {
	
	
	
	const cols = 40;
	const rows = 50;
	let gridSize = 30
	rad3 = Math.sqrt(3);
	let normalizedGridHeight = gridSize/rad3;
	
  return ({ context, width, height,playhead }) => {
    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);
	context.translate(0,0);
	for (let i = 0; i<cols*rows; i++) {
		const col = i % cols;
		const row = Math.floor(i/cols);
		const x = col * gridSize+(row%2==1?gridSize/2:0);
		const y = row * gridSize*rad3/2;
	//	console.log(x,y);
		drawMoon(context,x,y,playhead,null);
	}
	
	
	

	
	
  };
};

canvasSketch(sketch, settings);
