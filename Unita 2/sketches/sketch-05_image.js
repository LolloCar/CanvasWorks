const canvasSketch = require('canvas-sketch');
const {math,random} = require('canvas-sketch-util');


const canvasSize = 1080;
let manager;

let image;

let text ='A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const circle = (context,centerX,centerY,radius,fill) => {
  context.save();
  context.beginPath();
  context.arc(centerX,centerY,radius,0,Math.PI*2);
  if (fill) context.fill(); else context.stroke();
  context.restore();
}

const settings = {
  dimensions: [ canvasSize, canvasSize ]
};



const sketch = ({ context, width, height }) => {

  const cell = 10;
  const cols = Math.floor(width/cell);
  const rows = Math.floor(height/cell);
  
  const numCells = cols * rows;

  const imgW = cols;
  const imgH = rows;

  typeCanvas.width = imgW;
  typeCanvas.height = imgH;
  typeContext.drawImage(image,0,0,imgW,imgH);
      context.fillStyle = 'black';
    context.fillRect(0,0,width,height);
  return ({ context, width, height }) => {
    const typeData = typeContext.getImageData(0,0,imgW,imgH).data;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    

    colorz = ['red','green','blue'];
   
    colorz.forEach( (color) => {

    for (let i = 0; i < numCells; i++) {
      const col = i%cols;
      const row = Math.floor(i/cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];


      let glyph;
      switch (color) {
        case 'red':
          glyph = getGlyph(r);
          break;
        case 'green':
          glyph = getGlyph(g);
          break;
        case 'blue':
          glyph = getGlyph(b);
          break;        
        }
      
      context.fillStyle = color;// `rgb(${r},${g},${b},${a})`;
      context.font = `${cell *4}px ${fontFamily}`;

      context.save();
      context.translate(x+random.range(-1,1),y+random.range(-1,1));
      //context.strokeRect(0,0,cell,cell);
      context.translate(cell/2,cell/2);
      context.fillText(glyph,0,0);
      

      context.restore();
      //context.drawImage(typeCanvas,0,0);
    }
     });
  };
};




const getGlyph = (v) => {
  if (v< 50) return '';
  if (v<100) return random.pick(['.','\'']);
  if (v<150) return random.pick(['_','-']);
  if (v<200) return random.pick(['+','[',']','/']);
  const glyphs = '*=#/@'.split('');
  return random.pick(glyphs);
}

const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
}

//document.addEventListener('keyup',onKeyUp);

const url = 'bubi.png';

const loadMeSomeImage = (url) => {
  return new Promise((resolve,reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;

  })
}

const start = async() => {
  image = await loadMeSomeImage(url);
  console.log(image);
  canvasSketch(sketch, settings);
};

start();