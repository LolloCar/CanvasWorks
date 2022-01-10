const canvasSketch = require('canvas-sketch');
const math=require('canvas-sketch-util/math');
const delta = 1/50;
/**
* La funzione lamba da un'esponenziale ma non ho capito assolutamente come la cosa può essermi di aiuto. mistero!
* ci tornerò sopra.
*/
const settings = {
  dimensions: [ 2048, 2048 ],
  duration : 5,
  animate:true,
  fps:(1/delta),
  //this is the only way to achieve the fps in browser playback
  playbackRate:'throttle'
};

const sketch = ({width,height}) => {
  
  const o_min = width/5;
  const o_max = width * (4/5);
  const top   = height/4;
  const middle = height /2
  const bottom = height * 3/4;
  const size = width /8;
  let t = 0;
  
  return ({ context, width, height,frame,playhead,deltaTime,time }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	let step = playhead;
	let shift1 = o_min + playhead * (3/5 * width);
	let shift2 = math.lerp(o_min,o_max,playhead);
	let shift3 = math.damp(o_min,o_max,2,playhead);
	//console.log(frame/delta);
	context.save();
	context.translate(shift1,top);
	context.fillRect(-size/2,-size/2,size,size);
	context.restore();
	context.translate(shift2,middle);
	context.fillRect(-size/2,-size/2,size,size);
	context.restore();
	context.save();
	context.translate(shift3,bottom);
	context.fillRect(-size/2,-size/2,size,size);
	context.restore();
	
	
  };
};

canvasSketch(sketch, settings);
