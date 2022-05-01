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

const playheadDuration = 1.4;
let lastPlayhead=0;

const blockSize = 5;

const size =100;
const mortar = 10;
const der_blockWidth = size * blockSize;
const der_margin = (canvasSize - der_blockWidth - mortar*(blockSize-1))/2;



const sketch = () => {
	
  for (let i = 0; i < (blockSize*blockSize); i++) {
	let s = new Square(der_margin+(size+mortar)*(i%blockSize),
				der_margin+(size+mortar)*Math.floor(i/blockSize),
				random.pick(['A','B','C','E','H','L','N']),
				random.rangeFloor(0,4),
				random.rangeFloor(1,4) //speed
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
	
	context.lineWidth  = 8;
	 

	//console.log(myPlayhead);
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'blue';
	context.strokeStyle = 'blue';
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
		this.offset = random.value();
	}
	
	setAnimation (animation) {
		this.animation = animation;
	}
	
		
	finish() {
		//this.speed = random.rangeFloor(1,4);
		//console.log(this.animation.getName()+" finished ");
		this.shape = this.animation.getFinalShape();
		//console.log("New shape :"+this.shape);
		this.rotation = (this.rotation + this.animation.getFinalRotation()) % 4;
		//console.log('Current rotation :'+this.rotation);
		this.setAnimation(_chooseRandomAnimation(this.shape));
		//console.log(this.animation.getName()+" started");
	}
	
	draw(context,time) {
		let timeT = Math.max(time-this.offset,0);
		let playhead = ((timeT/this.speed)% playheadDuration)/playheadDuration;
		if (this.lastPlayhead>playhead) {
			this.finish();
		}
		this.lastPlayhead = playhead;
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
				new Animation('AtoA1','A',1,false)
				//,new Animation('AtoA2','A',3,false)
				//,new Animation('
				
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
				/*new Animation('CtoH1','H',14,false)
				,new Animation('BtoC1','B',0,true)
				,*/new Animation('CtoE1','E',14,false)
				//,new Animation('CtoE2','E',14,false)
			]
		);
		case 'E' : //Quadrato
			return random.pick( 
			[ //bisogna cambiare la logica: l'animazione può dipendere dalla rotazione finale?
				new Animation('BtoE','B',0,true)
				,new Animation('EtoH1','H',14,false)
				,new Animation('CtoE1','C',0,true)
				,new Animation('EtoL','L',14,false) //to nothing
				,new Animation('EtoN','N',14,false)
			]
			);

		case 'H' : //Barre a X
			return random.pick( 
			[ 
				new Animation('BtoH1','B',0,true),
				new Animation('CtoH1','C',5,true),
				new Animation('AtoH1','A',0,true)
				,new Animation('EtoH1','E',14,true)
			]
			);
		case 'L' : // nulla
			return random.pick(
			[
				new Animation('EtoL','E',14,true)
			
			]
			);
		case 'N' : //Cerchio pieno in quadrato
			return random.pick(
			[
				new Animation('EtoN','E',14,true)
			]
			);
	}
}


function _draw(animation,square,context,playhead,reversed) {
	console.log('Drawing '+animation.getName()+' rotation = '+square.rotation);
	context.save();
	
	rotateAroundVector(context,square.x+size/2,square.y+size/2,square.rotation*Math.PI/2);
	context.translate(square.x,square.y);
	
	if (animation.reversed) playhead = 1-playhead;
	playhead = ease(playhead);
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
		case 'CtoE1': //a lines sprout and close the square
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(0,size);
			context.moveTo(size,0);
			context.lineTo(size,size);
			context.moveTo(0,0)
			context.lineTo(size*playhead,bump1(playhead,size));
			context.moveTo(size,size);
			context.lineTo(size*(1-playhead),size-bump1(playhead,size));
			context.stroke();
			break;
		case 'CtoE2': //trapezoes exit the shapes
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(size*p1,0);
			context.moveTo(size*(1-playhead),0);
			context.lineTo(size,size);
			context.stroke();
			break;
		case 'EtoH1': //chiude i lati a X
			pointA = lineSegmentsIntercept(pt(0,0),pt(size,size*playhead),pt(size,0),pt(size*(1-playhead),size));
			pointB = lineSegmentsIntercept(pt(0,size*(1-playhead)),pt(size,size),pt(size*playhead,0),pt(0,size));
			pointC = lineSegmentsIntercept(pt(size*playhead,0),pt(0,size),pt(0,0),pt(size,size*playhead));
			pointD = lineSegmentsIntercept(pt(size,0),pt(size*(1-playhead),size),pt(0,size*(1-playhead)),pt(size,size));
			//console.log(pointB,pointC);
			context.beginPath();
			//linea orizzontale sopra che cede dall'altro in basso a destra
			context.moveTo(0,0); //top-left
			context.lineTo(pointA.x,pointA.y); //top right to bottom right
			//linea orizzontale sotto che sale dal basso in alto a sinisra 
			context.moveTo(pointB.x,pointB.y); //top right to top left
			context.lineTo(size,size); //bottom right
			//linea verticale sinistra che il sopra scorre verso destra 
			context.moveTo(pointC.x,pointC.y); //top left to top right
			context.lineTo(0,size); //bottom left
			//linea verticale destra che il sotto scorre verso sinistra 
			context.moveTo(size,0); //top right
			context.lineTo(pointD.x,pointD.y); //bottom right to bottom left
			context.stroke();
			break;
		case 'EtoL' : //il rettangolo si stringe fino a sparire
			let z = size*(1-playhead);
			rotateAroundVector(context,size/2,size/2,Math.PI*playhead/2);
			//context.rotate(Math.PI*playhead);
			context.strokeRect((size-z)/2,(size-z)/2,z,z);
			break;
		case 'EtoN': //il cerchio entra nel quadrato
			context.strokeRect(0,0,size,size)
			let region = new Path2D();
			region.rect(0,0,size,size);
			context.beginPath();
			context.clip(region);
			context.moveTo(size/2,size/2);
			context.arc(-size/2+size*playhead,size/2,size/2,0,Math.PI*2);
			context.fill();
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

const lineSegmentsIntercept = (function(){ // function as singleton so that closure can be used
        
        var v1, v2, v3, cross, u1, u2;  // working variable are closed over so they do not need creation 
                                   // each time the function is called. This gives a significant performance boost.
        v1 = {x : null, y : null}; // line p0, p1 as vector
        v2 = {x : null, y : null}; // line p2, p3 as vector
        v3 = {x : null, y : null}; // the line from p0 to p2 as vector
        
        function lineSegmentsIntercept (p0, p1, p2, p3) {
            v1.x = p1.x - p0.x; // line p0, p1 as vector
            v1.y = p1.y - p0.y; 
            v2.x = p3.x - p2.x; // line p2, p3 as vector
            v2.y = p3.y - p2.y; 
            if((cross = v1.x * v2.y - v1.y * v2.x) === 0){  // cross prod 0 if lines parallel
                return false; // no intercept
            }
            v3 = {x : p0.x - p2.x, y : p0.y - p2.y};  // the line from p0 to p2 as vector
            u2 = (v1.x * v3.y - v1.y * v3.x) / cross; // get unit distance along line p2 p3 
            // code point B
            if (u2 >= 0 && u2 <= 1){                   // is intercept on line p2, p3
                u1 = (v2.x * v3.y - v2.y * v3.x) / cross; // get unit distance on line p0, p1;
               if(u1 >= 0 && u1 <= 1){
					return {
					x : p0.x + v1.x * u1,
					y : p0.y + v1.y * u1,
					};
				}
            }
            return false; // no intercept;
            // code point B end
        }
        return lineSegmentsIntercept;  // return function with closure for optimisation.
    })();
	
function ease(x) {
	return (1 - (1 - x) * (1 - x));
}

function bump1(x,amp) {
	return Math.abs(random.noise1D(x,1,1))*
	Math.abs(random.noise1D(1-x,1,1))*amp;

}

function pt(a,b) {
	return { x : a, y : b}
}