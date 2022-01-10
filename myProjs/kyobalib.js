const {random} = require('canvas-sketch-util');

const kyobalib =  {
	//draws a random triangle. The triangle is guaranteed to contain the center of the bounding box.
	//Each vertex can have a distance up to 'tolerance' from the bounding box. Notice that distance 
	//is calculated from the side (or prolongement of it)
	drawRandomTriangle: function(context,x,y,width,height,tolerance) {
		
	},
	//return a [x,y] point for the coordinates of a random point within 'tolerance' from the bounding box.
	randomPointNearBoxBorder: function(x,y,width,height,insideTolerance,outsideTolerance) {
		if (insideTolerance<0 || outsideTolerance<0) {
			alert('Tolerances must be positive.');
			return null;
		}
		let point = [random.range(x-outsideTolerance,x+width+outsideTolerance),
					random.range(y-outsideTolerance,y+height+outsideTolerance)];
		let d = this.distanceFromBoxBorder(x,y,width,height,[point[0],point[1]]);
		let tries = 0;
		let boxCenter = [x+width/2,y+height/2]
		//the algorithm to "sanitize" a point that is not satisfactory is really terrible, but seems to work.

		while ((d < 0 && Math.abs(d)>insideTolerance) || (d>0 && d>outsideTolerance)) {
			let d_abs = Math.abs(d);
			let newDistance = random.range(width/2-insideTolerance,Math.sqrt(2)*(width/2)+outsideTolerance);
			point = this.respatiatePoint(point,boxCenter,newDistance,0);
			d = this.distanceFromBoxBorder(x,y,width,height,[point[0],point[1]]);
			if (tries>5) {
				console.log('Took too long.');
				return null;
			}
		}
		return point;
	},

	//point p is in [x,y] form. Distance is negative if point is inside the box and positive if point is outside the box
	//TODO I could even calculate the distance from the vertex if the point is external to the vertex
	distanceFromBoxBorder : function(x,y,width,height,p) {
		//outside
		if (p[0] < x || p[1] < y) return Math.max(x-p[0],y-p[1]);
		if (p[0] > (x+width) || p[1] > (y+height)) return Math.max(p[0]-(x+width),p[1]-(y+height));
		//inside
		return Math.min(Math.abs(p[0]-x),Math.abs(p[1]-y),Math.abs(x+width-p[0]),Math.abs(y+height-p[1]))*-1
	},
	//given a point p  ([x,y]) and another point o, moves p at distance targetDistance from o, on the same segment.
	//It returns the final point [x,y].
	//if you provide a distanceFactor different from zero, moves p at a distance equal to originalDistance*distanceFactor
	respatiatePoint: function (p,o,targetDistance,distanceFactor) {
		if (typeof distanceFactor == 'undefined' || distanceFactor == null || distanceFactor==0)  {
			distanceFactor = targetDistance/this.pointsDistance(p,o);
		}
		return [(p[0]-o[0])*distanceFactor+o[0],(p[1]-o[1])*distanceFactor+o[1]];
	},

	pointsDistance: function(p1,p2) {
		const dx = p2[0]-p1[0];
		const dy = p2[1]-p1[1];
		return Math.sqrt(dx*dx + dy*dy);
	},
	//given a box, returns a box [x,y,width,height] that contains it (or one that is contained)
	//You can either pass newWitdh AND newHeight, OR the border (not both)
	//Border can be negative to get a "contained" box. 
	//Notice that if border = 20 the box is 40 pixels larger.
	enclosingBox : function (x,y,width,height,newWidth,newHeight,border) {
		if (typeof border == 'undefined' || border == null) border = 0;
		if (typeof newWidth == 'undefined' || newWidth == null) newWidth = 0;
		if (typeof newHeight == 'undefined' || newHeight == null) newHeight = 0;
		if ((border>0 && newHeight>0) || (border>0 && newWidth>0) || (border ==0 && newHeight==0 && newWidth==0))
		{
			alert('enclosingBox - illegalParameters');
			return null;
		}
		if (border!=0) {
			newWidth = width+border*2;
			newHeight= height+border*2;
		} 
		return [x+(width-newWidth)/2,y+(height-newHeight)/2,newWidth,newHeight];
	},

	//same as a enclosingBox but takes an array parameter [x,y,width,height]
	enclosingBox2 : function (box,newWidth,newHeight,border) {
		return this.enclosingBox(box[0],box[1],box[2],box[3],newWidth,newHeight,border);
	}


}

exports.kyobalib = kyobalib;