const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const {klib} = require('../../kyobalib');

const canvasSize = 1080;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate:true,
  fps:60,
  duration: 20
}


const numberOfPoints = 30;
const layers = 10;
const circleRadius = canvasSize * 0.5;
const rotationSpeed = math.degToRad(0.5);
const thickness = 2;
const sketch = () => {
	
  const origin = [settings.dimensions[0]/2,1080/2];
  const circleA = [];
  const circleB = [] ;
  
  for (let j = 0; j<numberOfPoints; j++) {
	  for (let i = 1; i<=layers;i++) {
		  circleA.push(new PPoint(j * Math.PI*2 /numberOfPoints, f_layerization(i/layers) ));
		  circleB.push(new PPoint(j * Math.PI*2 /numberOfPoints, f_layerization(i/layers) ));
	  }
  }
  
  let fframe = 0;
  
  
  return ({ context, width, height }) => {
	
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
	context.strokeStyle = 'yellow';
	context.lineWidth = thickness;
	//context.scale(1,0.5);
	context.beginPath();
	for (let j = 0; j<numberOfPoints*layers; j++) {
	 circleA[j].az -= rotationSpeed;	
     cp1 = klib.ptc(f_radiusF(fframe+20)*circleA[j].r,circleA[j].az,origin);
	 circleB[j].az += rotationSpeed;
	 
	 cp2 = klib.ptc(f_radiusF(fframe)*circleB[j].r,circleB[j].az,origin);
	// console.log('x= '+cp2);
	 context.moveTo(cp1[0],cp1[1]);
	 context.arc(cp1[0],cp1[1],2,0,Math.PI*2);
	// console.log('from',cp1[0],cp1[1]);
	 context.lineTo(cp2[0],cp2[1]); 
	 context.arc(cp2[0],cp2[1],2,0,Math.PI*2);
	// console.log('to',cp2[0],cp2[1]);
	}
	context.stroke();
	fframe++;
  };
};

function f_layerization(x) {
	return (1 - (1 - x) * (1 - x))*circleRadius;
	//return factor * circleRadius;	
}

function f_radiusF(factor) {
	return (1+Math.sin(factor/100))/2;
}
/**
* point to array
*/
function pta(point) {
	return [point.x,point.y];
}

class PPoint {
	constructor(az,r) {
		this.az = az;
		this.r = r;
	}
	
	toString() {
		return 'az = '+this.az+', r = '+this.r;
	}
}

canvasSketch(sketch, settings);
