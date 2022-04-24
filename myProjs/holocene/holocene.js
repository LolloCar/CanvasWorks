const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const canvasSize = 1080;

const settings = {
  dimensions: [ canvasSize, canvasSize ],
  animate:true,
  duration: 50,
  fps : 20,
  loop:false
};

const squares= [];

const playheadDuration = 1;
let lastPlayhead=0;

const blockSize = 10;

const size = 100;

const der_blockWidth = size * blockSize;
const der_margin = (canvasSize - der_blockWidth)/2;


const sketch = () => {
	
  for (let i = 0; i < (blockSize*blockSize); i++) {
	let s = new Square(der_margin+size*(i%blockSize),
				der_margin+size*Math.floor(i/blockSize),
				random.pick(['A','B','C','E','H']),
				random.rangeFloor(0,4),
				random.rangeFloor(0,3) //speed
				);
	/***
	* DEBUG
	****/
	//s.setAnimation(new Animation('BtoH1','B',0,true));
	/**
	* NORMAL
	***/
	s.setAnimation(_chooseRandomAnimation(s.shape));
	squares.push(s); 
 }
  return ({ context, width, height,time }) => {
	
	context.lineWidth  = 4;
	 

	//console.log(myPlayhead);
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	squares.forEach( c=> c.draw(context,time));
  };
};

class Square {
	constructor (x,y,startingShape,startingRotation,speed) {
		this.x = x;
		this.y = y;
		//this.size = size;
		this.shape = startingShape;
		this.speed = speed;
		
		this.rotation = getActualRotation(startingRotation);
	}
	
	setAnimation (animation) {
		this.animation = animation;
	}
	
		
	finish() {
		//console.log(this.animation.getName()+" finished ");
		this.shape = this.animation.getFinalShape();
		//console.log("New shape :"+this.shape);
		this.rotation = (this.rotation + this.animation.getFinalRotation()) % 4;
		console.log('Current rotation :'+this.rotation);
		this.setAnimation(_chooseRandomAnimation(this.shape));
		//console.log(this.animation.getName()+" started");
	}
	
	draw(context,time) {
		let playhead = (time/this.speed)% playheadDuration)/playheadDuration;
		if (this.lastPlayhead>playhead) {
			this.finish();
		}
		this.lastPlayhead = myPlayhead;
		this.animation.draw(this,context,playhead);
	}
}

class Animation {
	
	constructor(name,finalShape,finalRotation,reversed) {
		this.name = name;
		this.finalShape = finalShape;
		this.finalRotation = finalRotation;
		this.reversed = reversed;
	}
	
	getFinalShape() {return this.finalShape;}
	
	getFinalRotation() {
		return getActualRotation(this.finalRotation);}
	
	draw(square,context,playhead) {
	   _draw(this,square,context,playhead);
	}
	
	getName() { return this.name + (this.reversed?' reversed':'')};
}

canvasSketch(sketch, settings);

function _chooseRandomAnimation(shape) {
	//console.log('Choosing random animation for shape '+shape);
	
	switch(shape) {
		case 'A' : //Barra in 1
		return random.pick (
			[
				new Animation('AtoH1','H',14,false),
				new Animation('AtoA1','A',1,false),
				new Animation('AtoA2','A',3,false)
			]
		);
		case 'B' : //Barra in 1 e in 2
		return random.pick( 
			[
				new Animation('BtoC1','C',2,false),
				new Animation('BtoH1','H',14,false),
				new Animation('BtoE','E',14,false)
			]
		);
		break;
		case 'C' : //Barra in 1 e in 3
		return random.pick( 
			[
				new Animation('CtoH1','H',14,false)
			]
		);
		case 'H' : //Barre a X
			return random.pick( 
			[ //bisogna cambiare la logica: l'animazione può dipendere dalla rotazione finale?
				new Animation('BtoH1','B',0,true),
				new Animation('CtoH1','C',5,true),
				new Animation('AtoH1','A',0,true)
			]
		);
		case 'E' : //Quadrato
			return random.pick( 
			[ //bisogna cambiare la logica: l'animazione può dipendere dalla rotazione finale?
				new Animation('BtoE','B',0,true)
			]
				
		);
		break;
	}
}


function _draw(animation,square,context,playhead,reversed) {
	//console.log('Drawing '+animation.getName()+' rotation = '+square.rotation);
	context.save();
	
	rotateAroundVector(context,square.x+size/2,square.y+size/2,square.rotation*Math.PI/2);
	context.translate(square.x,square.y);
	
	context.strokeStyle = 'black';
	if (animation.reversed) playhead = 1-playhead;
	
	let p1=(playhead<0.5 ? playhead * 2 : 1);
	let p2=(playhead>0.5 ? (playhead - 0.5)*2 : 0);
	
	switch (animation.name) {
		case 'AtoA1': //barra gira intorno al verticec
			context.rotate(-Math.PI*playhead/2);
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(0,size);
			context.stroke();
			break;
		case 'AtoA2': //barra scivola da 0 a 3, con scia
			//da 0 a P1 
			let j = 0;
			while(j<=p1 && p2 == 0) {
				context.beginPath();
				context.moveTo(0,j*size);
				context.lineTo(Math.sqrt(2*j-j*j)*size,size);
				context.stroke();
				j += 0.1;
			}
			j = 1;
			while(j>p2 && p1 == 1) {
				context.beginPath();
				context.moveTo(0,j*size);
				context.lineTo(Math.sqrt(2*j-j*j)*size,size);
				context.stroke();
				j -= 0.1;
			}
			break;
		case 'AtoH1' : 
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(size*playhead,size);
			context.moveTo(0,size);
			context.lineTo(size*playhead,0);
			context.stroke();
			break;
		case 'BtoC1': //barra in posizione 2 viaggia verso la posizione 3, non mantiene la lunghezza
			//todo mantenere la lunghezza
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(0,size);
			context.moveTo(0+playhead*size,0);
			context.lineTo(size,0+(Math.sqrt(2*playhead-playhead*playhead))*size);
			context.stroke();
			break;
		case 'BtoE': //barra in posizione 2 viaggia verso la posizione 3, non mantiene la lunghezza
			//todo mantenere la lunghezza
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(0,size);
			context.moveTo(0,0);
			context.lineTo(size,0);
			context.lineTo(0+playhead*size,0+playhead*size),
			context.lineTo(0,size);
			context.closePath();
			context.stroke();
			break;
		case 'BtoH1': //lato dx di pos 2 verso basso, poi lato alto di 1 verso dx

			//console.log(p1,p2);
			context.beginPath();
			//pos 2
			context.moveTo(0,0);
			context.lineTo(size,0+p1*size);
			context.moveTo(0,size);
			context.lineTo(0+size*p2,0);
			context.stroke();
			break;
		case 'CtoH1': 
			context.beginPath();
			context.moveTo(0+size*playhead,0);
			context.lineTo(0,size);
			context.moveTo(size*(1-playhead),0);
			context.lineTo(size,size);
			context.stroke();
			break;
		default : 
		// console.log('Unknow animation : '+name);
	}
	context.restore();
	
	
}

function rotateAroundVector(context,x,y,rotation) {
	context.translate(x,y);
	context.rotate(rotation);
	context.translate(-x,-y);
}

function getActualRotation(rotation) {
	    //0 to 3 are 90° * number
		//4 : 0 or 1
		//5 : 0 or 2
		//6 : 0 or 3
		//7 : 1 or 2
		//8:  1 or 3
		//9:  2 or 3
		//10 : 0,1 or 2
		//11 : 0,1 or 3
		//12 : 0,2 or 3
		//13 : 1,2 or 3
		//14 : any
		switch (rotation) {
			case 14:
				return random.pick([0,1,2,3]);
			case 5:
				return random.pick([0,2]);
			default :
				return rotation;
		}
}



