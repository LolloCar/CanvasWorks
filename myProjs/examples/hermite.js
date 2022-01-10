const canvasSketch = require('canvas-sketch');
const math=require('canvas-sketch-util/math');
const settings = {
  dimensions: [ 2048, 2048 ],
  animate:true
};

const sketch = ({width,height}) => {
  
  const o_min = width/5;
  const o_max = width * (4/5);
  const top   = height/4;
  const bottom = height * 3/4;
  const size = width /8;
  let t = 0;
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
	let step = math.pingPong((t++)/100,1);
	let shift2 = math.lerp(o_min,o_max,step);
	let smoothStep = math.smoothstep(0,1,step);
	let shift3 = math.mapRange(smoothStep,0,1,o_min,o_max);
	
	context.save();
	context.translate(shift2,top);
	context.fillRect(-size/2,-size/2,size,size);
	context.restore();
	context.translate(shift3,bottom);
	context.fillRect(-size/2,-size/2,size,size);
	
	
  };
};

canvasSketch(sketch, settings);
