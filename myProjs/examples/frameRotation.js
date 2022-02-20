const canvasSketch = require('canvas-sketch');
const math  = require('canvas-sketch-util/math');
const settings = {
  dimensions: [ 1000, 1000 ],
  animate:true
};

const sketch = () => {

  let angle = 90;	
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	context.fillStyle = 'black';
    

    angle++;

    context.translate(width/2,height/2);
    

    context.rotate(math.degToRad(angle))

    context.beginPath();
    context.arc(200,0,20,0,Math.PI*2);
    context.fill();

  };
};

canvasSketch(sketch, settings);
