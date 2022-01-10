const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const geometry  = require('canvas-sketch-util/geometry');
const {kyobalib} = require('../kyobalib');
const settings = {
  dimensions: [ 1000, 1000 ]
};


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

  const box = [width/4,height/4,width*0.75,height*0.75];


  const p1 = [50,50];
  const p2 = [770,870];
  const p3 = [200,470];
  const p4 = [630,355];
  const p5 = [590,270];
  const p6 = [690,270];
  //using lines of more than 2 points has sense only if you use the "border" option
  let newLines = geometry.clipPolylinesToBox([[p1,p2],[p2,p3],[p3,p4]], box, false,false);
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#DDDDDD';

    //draw 'box'  
    context.fillRect(box[0],box[1],box[2]-box[0],box[3]-box[1]);
    context.fillStyle = 'black';
    //drawP1
    circle(context,p1[0],p1[1],10,true);
    //drawP2
    circle(context,p2[0],p2[1],10,true);
    //drawP3
    circle(context,p3[0],p3[1],10,true);
    //drawP4
    circle(context,p4[0],p4[1],10,true);
    context.fillStyle = 'red';
    //drawP5,p6
    circle(context,p5[0],p5[1],10,true);
    circle(context,p6[0],p6[1],10,true);
    context.fillStyle = 'green';
    //draw respatiatedPoint
    let respP5 = kyobalib.respatiatePoint(p5,p4,0,2);
    circle(context,respP5[0],respP5[1],10,true);
    let respP6 = kyobalib.respatiatePoint(p6,p4,300,0);
    console.log('distance p4 -> respP6 '+kyobalib.pointsDistance(respP6,p4));
    circle(context,respP6[0],respP6[1],10,true);
    
    console.log('p1 -> box '+kyobalib.distanceFromBoxBorder(box[0],box[1],box[2]-box[0],box[3]-box[1],p1));
    console.log('p2 -> box '+kyobalib.distanceFromBoxBorder(box[0],box[1],box[2]-box[0],box[3]-box[1],p2));
    console.log('p3 -> box '+kyobalib.distanceFromBoxBorder(box[0],box[1],box[2]-box[0],box[3]-box[1],p3));
    console.log('p4 -> box '+kyobalib.distanceFromBoxBorder(box[0],box[1],box[2]-box[0],box[3]-box[1],p4));
    console.log('p5 -> box '+kyobalib.distanceFromBoxBorder(box[0],box[1],box[2]-box[0],box[3]-box[1],p5));

    //draw clipz
    for (line in newLines) drawLines(context,newLines[line]);


  };
};

canvasSketch(sketch, settings);
