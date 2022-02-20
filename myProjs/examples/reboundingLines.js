const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const geometry  = require('canvas-sketch-util/geometry');
const {klib} = require('../../kyobalib');
const settings = {
  dimensions: [ 1000, 1000 ]
};
/*********************************
 * 
 * Experiments with line clipping and other shit
 * *******************************/

/****
 * FUNCTIONS
 *****/

const circle = (context,centerX,centerY,radius,fill) => {
  context.save();
  context.beginPath();
  context.arc(centerX,centerY,radius,0,Math.PI*2);
  if (fill) context.fill(); else context.stroke();
  context.restore();
}

const drawLines = (context,lines) => {
  //If I got an array of points, consider it as a single line
  if (!(lines[0][0].constructor === Array)) {
    lines = [lines];
  }

  for (let j = 0;j < lines.length; j++){
    const line = lines[j];
    context.beginPath();
    context.moveTo(line[0][0],line[0][1]);
    for (let i = 1; i<line.length;i++) {
      context.lineTo(line[i][0],line[i][1]);
    }
    context.stroke();
    }
}

/**********
* MAIN
* ***********/

const sketch = ({width, height}) => {

  const box = [width/3,height/5,width*0.85,height*0.85];


  const p1 = [100,50];
  const p2 = [700,900];
  const p3 = [200,470];
  const p4 = [630,355];
  const p5 = [590,270];
  const p6 = [690,270];
  const p7 = [600,600];
  const p8 = [800,800];

  let polyLine = [p1,p2,p3,p4,p5];
  let polyLines = [polyLine];
  //using lines of more than 2 points has sense only if you use the "border" option
  //If I pass an array of 5 points, it doesn't clip shit
  //I can pass a line of 5 points or 4 2-points array and it's the same (as long as it's an array of lines)
  let newLines = geometry.clipPolylinesToBox(polyLines, box, false,false);
  const b = geometry.getBounds(polyLine);
  console.log('Bounds ='+b);
  const boundingCube = klib.box_MmToHw([b[0][0],b[0][1],b[1][0],b[1][1]]);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#DDDDDD';

    drawLines(context,polyLine);

    context.lineWidth = 5;
    drawLines(context,newLines);
    //draw 'box'  
    context.strokeRect(box[0],box[1],box[2]-box[0],box[3]-box[1]);
    context.strokeRect(boundingCube[0],boundingCube[1],boundingCube[2],boundingCube[3]);
    context.fillStyle = 'black';
    //drawP1
    circle(context,p1[0],p1[1],10,true);
    //drawP2
    circle(context,p2[0],p2[1],10,true);
    //drawP3
    circle(context,p3[0],p3[1],10,true);
    //drawP4
    circle(context,p4[0],p4[1],10,true);
    
    //drawP5,p6
    circle(context,p5[0],p5[1],10,true);
    circle(context,p6[0],p6[1],10,true);
    context.strokeStyle='red';
    drawLines(context,klib.reboundLine(polyLine,klib.box_MmToHw(box)),false);


  };
};

canvasSketch(sketch, settings);
