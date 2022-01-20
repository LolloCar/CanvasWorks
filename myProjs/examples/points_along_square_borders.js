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
 * Experiments with kyobalb (points near a box border)
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

const drawLines = (context,points) => {
  //console.log('Drawing '+points);
  context.beginPath();
  context.moveTo(points[0][0],points[0][1]);
  for (let i = 1; i<points.length;i++) {
    //console.log('Drawing to '+i+'='+points[i]);
    context.lineTo(points[i][0],points[i][1]);
  }
  context.stroke();
}

/**********
* MAIN
* ***********/

const sketch = ({width, height}) => {

  const insideTolerance = 50;
  const outsideTolerance= 50;
  const box = [width/4,height/4,width/2,height/2];
  const numOfBallz = 2000;
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#DDDDDD';
    context.strokeStyle = 'black';
    //draw 'box'  
    context.fillRect(box[0],box[1],box[2],box[3]);
    let encBox = klib.box_alignedBox2(box,null,null,100);
    console.log(encBox);
    context.strokeRect(encBox[0],encBox[1],encBox[2],encBox[3]);

    context.fillStyle = 'black';
    for (let i = 0;i<numOfBallz;i++)  {
       const p = klib.box_randomPointNearBoxBorder(box[0],box[1],box[2],box[3],insideTolerance,outsideTolerance);
       if (p!=null) circle(context,p[0],p[1],5,true);
    }


    
  };
};

canvasSketch(sketch, settings);
