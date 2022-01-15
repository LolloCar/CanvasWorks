const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require ('tweakpane');

const settings = {
	dimensions: [ 1080, 1080 ]
	,animate:true
};

const params = {
	
	bounce: false,
	ballMinSize : 4,
	ballMaxSize : 12
}

const agents = [];

const sketch = ({ context, width, height }) => {
	
	
		
	for (let i = 0; i<40;i++) 	{
		const x = random.range(0,width);
		const y = random.range(0,height);
		agents.push(new Agent(x,y));
		
   }
	
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
	
	for (let i = 0; i<agents.length; i++) {
		const agent = agents[i];
		for (let j = i+1; j<agents.length; j++) {
			const other = agents[j];
			const dist = agent.pos.getDistance(other.pos);
			
			if (dist > 300) continue;
			
			context.lineWidth=math.mapRange(dist,0,300,12,1);
			context.beginPath();
			context.moveTo(agent.pos.x,agent.pos.y);
			context.lineTo(other.pos.x,other.pos.y);
			context.stroke();
		}
	}
	
	agents.forEach(agent => {
		agent.update();
		agent.draw(context);
		if (params.bounce) {
			agent.bounce(width,height);
		} else {
		agent.wrap(width,height);
	}
	});
  };
};

canvasSketch(sketch, settings);

class Vector {
	constructor(x,y,radius) {
		this.x = x;
		this.y = y;
		
	}
	
	getDistance(v) {
		const dx = this.x-v.x;
		const dy = this.y-v.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
}

class Agent {
	constructor(x,y) {
		this.pos = new Vector(x,y);
		this.vel = new Vector(random.range(-1,1.5),random.range(-1,1.5));
		this.radius = random.range(params.ballMinSize,params.ballMaxSize);
	}
	
	update () {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
	}
	
	bounce(width,height) {
		if (this.pos.x<=0 || this.pos.x>=width) {
			this.vel.x *= -1;
		}
		if (this.pos.y<=0 || this.pos.y>=height) {
			this.vel.y *= -1;
		}
	}
	
	wrap(width,height) {
		if (this.pos.x<=0) { 
			this.pos.x = width;
		} else if (this.pos.x>=width) {
			this.pos.x = 0;
		}
		if (this.pos.y<=0) { 
			this.pos.y = height;
		} else if (this.pos.y>=height) {
			this.pos.y = 0;
		}
	}
	
	draw(context) {
		
		context.save();
		context.translate(this.pos.x,this.pos.y);
		context.beginPath();
		context.arc(0,0,this.radius,0,Math.PI*2);
		
		context.fill();
		context.lineWidth = 4;
		context.stroke();
		
		context.restore();
	}
}

const remakeAgents = () => {
	agents.forEach(item => item.radius=random.range(params.ballMinSize,params.ballMaxSize));
}

const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;
	
	folder = pane.addFolder({title:'First folder'});
	folder.addInput(params,'bounce');
	folder.addInput(params,'ballMinSize', {label:'Min size',min:1 , max:50, step:1}).on('change',remakeAgents);
	folder.addInput(params,'ballMaxSize', {label:'Max size',min:1 , max:50, step:1});
	
	
	
}

createPane();	