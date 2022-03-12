const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const color = require('canvas-sketch-util/color');

const ss = 1080; //sketch sizde
const rl = 20; //drop length
const rs = 20;

const nos = 10; //number of sections
const wos = ss/nos; // width of section;
const fod = 100; //density of drops for a wos*wos section

const settings = {
  dimensions: [ ss, ss ],
  animate:true
};

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({width, height }) => {
	
	typeCanvas.width = width;
	typeCanvas.height = height;
	
  const drops = [];

  //Starting rain setup
  for (let i = 0; i<nos;i++) {
	  for (let j = -1; j<nos; j++) {
		  for (let k = 0; k<fod; k++) {
			  const dx = random.range(i*wos,(i+1)*wos);
			  const dy = random.range(j*wos,(j+1)*wos);
			  const vs = random.range(rs*0.5,rs);
			  drops.push(new Raindrop(dx,dy,0,vs));
		  }
	  }
  }
  
  let frameRoller = wos-rs+1;
  
  //cerchio nero sull'altro canvas
  /*typeContext.fillStyle = 'white';
  typeContext.fillRect(0,0,width,height);
  typeContext.fillStyle = 'black';
  typeContext.beginPath();
  typeContext.arc(width/2,height/2,200,0,Math.PI*2);
  typeContext.fill();*/
    typeContext.drawImage(image,0,0,width,height);
  const typeData = typeContext.getImageData(0,0,width,height).data;
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.strokeStyle = 'black';
	
	//cycle raindrops removing the ones going out
	for (let i = drops.length - 1; i >= 0; i--) {
		drops[i].draw(context,typeData);
		drops[i].update();
		if (drops[i].pos.y >ss) {
			drops.splice(i, 1);
		}
	}
	 
	
	
	//When frameRoller exceeds the strip height , populate the drops 
	//in the second-to-last horizontal strip
	frameRoller += rs; 
	if (frameRoller>wos) {
		frameRoller = frameRoller%wos;
		for (let i = 0; i<nos;i++) {
			for (let k = 0; k<fod; k++) {
				const dx = random.range(i*wos,(i+1)*wos);
				const dy = random.range(-2*wos,-1*wos);
				 const vs = random.range(rs*0.66,rs);
				drops.push(new Raindrop(dx,dy,0,vs));
			}
		}
	}
	//context.drawImage(typeContext,0,0,width,height);
  };
  
};

class Raindrop {
	constructor (x,y,speedX,speedY) {
		this.pos = {};
		this.speed= {};
		this.pos.x = x;
		this.pos.y = y;
		this.speed.x = 0;
		this.speed.y = speedY;
	}
	
	
	draw(context,typeData) {
		context.save();
		
		
		let index = Math.floor(this.pos.x)+ss*Math.floor(this.pos.y)  ;
		const r = typeData[index*4 + 0];
		const g = typeData[index*4 + 1];
		const b = typeData[index*4 + 2];
		const a = typeData[index*4 + 3];
		//`rgb(${r},${g},${b},${a})`;

		
		
		let greyscale = 0;
		if (this.pos.x <0 || this.pos.y<0) {
			context.strokeStyle = 'black'
		} else {
			context.strokeStyle =  `rgb(${r},${g},${b})`
			//context.lineWidth='3';
		}// 255 * (1-this.speed.y /rs);
		//console.log(greyscale);
		
		context.beginPath();
		context.moveTo(this.pos.x,this.pos.y);
		context.lineTo(this.pos.x,this.pos.y+rl);
		context.stroke();
		context.restore();
	}
	
	update () {
		this.pos.y += this.speed.y;
	}
}

canvasSketch(sketch, settings);

const url = 'WIN_20220213_20_30_53_Pro.jpg';

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
