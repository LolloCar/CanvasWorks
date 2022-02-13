const canvasSketch = require('canvas-sketch');
const random  = require('canvas-sketch-util/random');
const math  = require('canvas-sketch-util/math');
const Color  = require('canvas-sketch-util/color');
const Tweakpane = require ('tweakpane');


const sketchSize = 1080;

const settings = {
  dimensions: [ sketchSize, sketchSize ],
  animate:true,
  duration:60,
  fps:30

};

const params = {
	time:0,
	animate:true,
	drawWaves : true,
	showSunRotationCenter : false,
	showSunAdditionalRadius : false
}

const transitionDuration = 4;

const palettes = [];

let isTransitioning = false;

let currentPaletteIndex = 0;

let transitionStartTime = -1;

//Palettes : prima onda (dallo sfondo), seconda onda, terza onda e sfondo, sole/luna
//rosa,grigio,salmone,blu elettrico
palettes.push(['#FEECE9','#CCD1E4','#FE7E6D','#2F3A8F']);
palettes.push(['#FFF89A','#FFC900','#086E7D','#1A5F7A']);
palettes.push(['#781C68','#9A0680','#FFD39A','#FFF5E1']);
palettes.push(['#D9D7F1','#FFFDDE','#E7FBBE','#FFCBCB']);
//blu / grigio (dark) - alternativa
palettes.push(['#787A91','#141E61','#0F044C','#EEEEEE']);
//ghiaccio, carminio, antracite, nero
palettes.push(['#30475E','#F05454','#121212','#F5F5F5']);
palettes.push(['#8E05C2','#700B97','#3E065F','#000000']);


//TODO aggiungere linee col culo largo(nuvole) che vanno lentamente da destra a sinistra

let sunPosition = 0; //0 = left ; 1 - transitioning left to right ; 2 - right; 3 - transitioning right to left
let sunRotationCenter =  { x: sketchSize/2,y : sketchSize/2};
const sunRotationRadius = sketchSize /2


const circle = (context,centerX,centerY,radius,fill) => {
	context.save();
	context.beginPath();
	context.arc(centerX,centerY,radius,0,Math.PI*2);
	if (fill) context.fill(); else context.stroke();
	context.restore();
}

//returns 0 to amplitude
const normalizedNoise2D = (x,y,amplitude) => {
	return (random.noise2D(x,y, 0.04,amplitude)+amplitude)/2;
}

/**
 *  Returns a random point from Noise2D indide a box (vertices minX/minY and maxX/maxY )
 * noiseX and noiseY are the coordinates in the noise map. They are inverted for X and Y of position
 */
const randomPoint = (noiseX,noiseY,minX,minY,maxX,maxY) => {
	return { x: minX+normalizedNoise2D(noiseX,noiseY,maxX-minX),y: minY+normalizedNoise2D(noiseY,noiseX,maxY-minY)}
}

const drawCurvePoints = false;


const drawWave = (context,color,bound1,bound2,average1,frame,delta,fill) => {
	context.save();
	context.fillStyle =color;
	context.strokeStyle =color;
	
	let progression = frame;
	
	let startA = randomPoint(progression,delta,-bound1,average1,0,average1+bound1,300);
	let control1A =  randomPoint(progression,delta+10,0+bound2,average1,sketchSize/2,average1+bound1,300);
	let control1B =  randomPoint(progression,delta+20,sketchSize/2+bound2,average1,sketchSize/2+bound1,average1+bound1,300);
	let endA =  randomPoint(progression,delta+30,sketchSize,average1,sketchSize+bound1,average1+bound1,300);
	
	
	// Cubic Bézier curve
	context.beginPath();
	context.moveTo(startA.x, startA.y);
	context.bezierCurveTo(control1A.x, control1A.y, control1B.x, control1B.y, endA.x, endA.y);
	context.lineTo(sketchSize+20,sketchSize+20);
	context.lineTo(-20,sketchSize+20);
	context.closePath();
	
	if (fill) context.fill(); else context.stroke();
	context.restore();
}

let palette,nextPalette;

const cyclePalettes = () => {
	//console.log('Old palette = '+(palette?palette:'undefined'));
	palette = palettes[currentPaletteIndex];
	nextPalette = palettes[math.wrap(currentPaletteIndex+1,0,palettes.length)];
	//console.log('New palette = '+(palette));
}


//https://gist.github.com/gre/1650294 easeInOutQuad
//let ease = (t) => { return t<.5 ? 2*t*t : -1+(4-2*t)*t};

let phase = false;


class Cloud {

	constructor(x,y,size,speed) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.speed = speed;
		console.log(this);
	} 

	draw(context,color) {
		context.strokeStyle = 'black';
		context.lineWidth = 50;
		context.lineCap = 'round';
		context.beginPath();
		context.moveTo(this.x,this.y);
		context.lineTo(this.x+this.size,this.y);
		context.stroke();
	}



}

const clouds = [];

const sketch = ({width, height}) => {
	
	//utilizzati nel disegno delle "onde"
  const bound1 = sketchSize/8;
  const bound2 = sketchSize/4;
  
  const average1 = sketchSize * 0.75;
  
  cyclePalettes();
  
  let sunRotation = math.degToRad(360);

  for (let i = 0; i<1; i++){
  	clouds.push(new Cloud(random.range(0,width),random.range(0,height/2),50,1));
  }

  return ({ context, width, height,frame,time,deltaTime }) => {

  	const t = params.animate ? time : params.time;
  	
		//the 0 - 1 time of transition
		let transitionProgress = ((t%transitionDuration) / transitionDuration);
		//mix the colors
		//console.log('Progress = '+transitionProgress);
		if (transitionProgress<0.5 && phase) {
				phase=false;
  			currentPaletteIndex = math.wrap(++currentPaletteIndex,0,palettes.length);
  			console.log('Palette index: '+currentPaletteIndex);
  			cyclePalettes();
  	}
  	if (transitionProgress>0.5) phase = true; //no other idea on how to execute the palette swap only once
		color0 = Color.blend(palette[0],nextPalette[0],transitionProgress).hex;
		color1 = Color.blend(palette[1],nextPalette[1],transitionProgress).hex;
		color2 = Color.blend(palette[2],nextPalette[2],transitionProgress).hex;
		color3 = Color.blend(palette[3],nextPalette[3],transitionProgress).hex;
		//let the sun go down
		sunRotation = Math.PI*2*transitionProgress;

	  //sunRotationCenter.x = math.pingPong(t*100 + width,width);
		//console.log(sunRotationCenter,math.radToDeg(sunRotation));
		
		const sunX = sunRotationCenter.x + sunRotationRadius * Math.cos(sunRotation);
		const sunY = sunRotationCenter.y + sunRotationRadius * Math.sin(sunRotation);
		const sunSize = 150;
		const	gradient = context.createRadialGradient(sunX,sunY,sunSize/2,sunX,sunY,width*1.5);
		gradient.addColorStop(0,color2);
		gradient.addColorStop(1,color3);
		//gradient.addColorStop(1,palette[2]);
		context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
		
		//draw "sun"
	 	context.fillStyle =  (color3);
		circle(context, sunX,sunY, sunSize,true);

		if (params.showSunRotationCenter) {
			circle(context, sunRotationCenter.x,sunRotationCenter.y, sunSize*2,false);			
		}
		if (params.showSunAdditionalRadius) {
			circle(context, sunX, sunY, sunSize*3,false);			
		}

		

		context.save();

		context.shadowColor = 'black';
		context.shadowBlur = 18;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;

		
		context.lineWidth = 10;
		if (params.drawWaves) {
		drawWave(context,color0,bound1,bound2,average1*0.7,t*25,100,true);
		drawWave(context,color1,bound1,bound2,average1*0.8,t*25,200,true);
		}
		//drawWave(context,(conditionOfDay?palette[2]:'yellow'),bound1,bound2,average1*1.15,frame,0,conditionOfDay);

		context.restore();
		
		//draw clouds
		clouds.forEach(cloud => cloud.draw(context));
		
		if (drawCurvePoints) {
			context.fillStyle = 'green';
			circle(context, startA.x,startA.y,10);
			context.fillStyle = 'red';
			circle(context, control1A.x,control1A.y,10);
			circle(context, control1B.x,control1B.y,10);
			circle(context, endA.x,endA.y,10);
			circle(context, 200+normalizedNoise2D(frame,10,100),100+normalizedNoise2D(10,frame,100), 10);
		}
	  };
};

canvasSketch(sketch, settings);

const createPane = () => {
	const pane = new Tweakpane.Pane();
	pane.addInput(params,'animate');
	pane.addInput(params,'drawWaves');
	pane.addInput(params,'showSunRotationCenter',{label : 'sun center'});
	pane.addInput(params,'showSunAdditionalRadius',{label : 'debug radius'});
	
	pane.addInput(params,'time',{min:0,max:5});
}

createPane();