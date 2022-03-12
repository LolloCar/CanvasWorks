const {random,geometry,math} = require('canvas-sketch-util');


const kyobalib =  {

	/*************
	 * 
	 * BOX SHIT EXTRAVAGANZA
	 * **********/

	//converts a [x,y,width,height] box to [minX,minY,maxX,maxY] box
	box_whToMm: function (box) {
		return [box[0],box[1],box[0]+box[2],box[1]+box[3]];
	},

	//converts a [minX,minY,maxX,maxY] box to [x,y,width,height] box
	box_MmToHw: function (box) {
		return [box[0],box[1],box[2]-box[0],box[3]-box[1]];
	},
	
	/**
	* Converts two points representing top left and bottom right of a rect in a XYWH box
	* @pa an array of two x-y arrays 
	* @returns an array (XYWH representation of the rect)
	*/
	box_pointArrayToWh : function (pa) {
		let p1=pa[0];let p2=pa[1];
		return [p1[0],p1[1],p2[0]-p1[0],p2[1]-p1[1]];
	},

	
	//returns the box [x,y,w,h] center
	box_getCenter : function (box) {
		if (!Array.isArray(box)) console.error('box_getCenter: arguments must be an array');
		return  [box[0]+box[2]/2,box[1]+box[3]/2];
	},

	// Takes 3 arguments, all arrays : 2 x-y points and a XYWH box
	//Given a segment from p0 to p1 and a box [x,y,width,height], returns
	//an array with the points of contact of the segment with the box. The segment extremes,p0 and p1,  
	//are returned only if they lay on the border of the box.
	//It's slightly more useful than bare clipPolyLinesToBox [DAVVERO? uhmmm]
	box_getSegmentIntersectionPoints: function (p0,p1,box) {
		const clippoints = geometry.clipPolylinesToBox([[p0,p1]], this.box_whToMm(box), false,false);
		let newArray = [];
		clippoints[0].forEach(pt => {
				if (this.box_distanceFromBorder(box[0],box[1],box[2],box[3],pt) == 0)
					newArray.push(pt);
				});
		return newArray;
	},

	//Given a [x,y,width,height] box and an angle, returns the distance of the box border from the center for the angle
	//FIXME maybe could be done better with simpler trigonometry? 
	box_getRadialDistance(box,angle) {
		const point = this.box_getPointAtAngle(box,angle);
		return this.pointsDistance(this.box_getCenter(box),point);
	},

	//Given a [x,y,width,height] box and an angle, returns the [x,y] point on the box border at said angle
	box_getPointAtAngle(box,angle) {
		//normalize the angle
		angle = math.wrap(angle,-Math.PI,Math.PI);
		const center = this.box_getCenter(box);
		const alpha =Math.atan(box[3]/box[2]);

		if ((angle<alpha && angle>(-alpha))){
			return [center[0]+box[2]/2,center[1]-Math.tan(angle)*box[2]/2];
		} else if (angle>(Math.PI-alpha) || angle<(alpha-Math.PI)) {
			return [center[0]-box[2]/2,center[1]-Math.tan(angle)*box[2]/2];
		} else if (angle>alpha && angle<(Math.PI-alpha)) {
			return [center[0]+(1/Math.tan(angle))*box[3]/2,center[1]+box[3]/2];	
		} else {
			return [center[0]+(1/Math.tan(angle))*box[3]/2,center[1]-box[3]/2];			
		}
	},
	

	//return a [x,y] point within 'tolerance' from the bounding box.
	//FUN FACT: no algorithm seems to be good enough for an even distribution of points
	box_randomPointNearBoxBorder: function(x,y,width,height,insideTolerance,outsideTolerance) {
		if (insideTolerance<0 || outsideTolerance<0) {
			console.error('Tolerances must be positive.');
			return null;
		}
		//ALGORITHM : I generate a random point in the box and then respatiate it inside the box
		const box = [x,y,width,height];
		const p = [random.range(x,x+width),random.range(y,y+height)];
		const center = this.box_getCenter(box);
		const p_angle = Math.atan2(p[0]-center[0],p[1]-center[1]);
		const sme = this.box_alignedBox2(box,null,null,-insideTolerance);
		const bme = this.box_alignedBox2(box,null,null,outsideTolerance);
		return this.respatiatePoint(p,center,math.mapRange(this.pointsDistance(p,center),
														   0,
														   this.box_getRadialDistance(box,p_angle),
														   this.box_getRadialDistance(sme,p_angle),
														   this.box_getRadialDistance(bme,p_angle),
			),0);
		
	},

	//point p is in [x,y] form. Distance is negative if point is inside the box and positive if point is outside the box
	//TODO Maybe I could even calculate the distance from the vertex if the point is external to the vertex?
	box_distanceFromBorder : function(x,y,width,height,p) {
		//outside
		if (p[0] < x || p[1] < y) return Math.max(x-p[0],y-p[1]);
		if (p[0] > (x+width) || p[1] > (y+height)) return Math.max(p[0]-(x+width),p[1]-(y+height));
		//inside
		return Math.min(Math.abs(p[0]-x),Math.abs(p[1]-y),Math.abs(x+width-p[0]),Math.abs(y+height-p[1]))*-1
	},

	//given a box, returns a box [x,y,width,height] that contains it (or one that is contained) - i.e. sharing same center
	//You can either pass newWitdh AND newHeight, OR the border (not both)
	//Border can be negative to get a "contained" box. 
	//Notice that if border = 20 the box is 40 pixels larger.
	box_alignedBox : function (x,y,width,height,newWidth,newHeight,border) {
		if (typeof border == 'undefined' || border == null) border = 0;
		if (typeof newWidth == 'undefined' || newWidth == null) newWidth = 0;
		if (typeof newHeight == 'undefined' || newHeight == null) newHeight = 0;
		if ((border>0 && newHeight>0) || (border>0 && newWidth>0) || (border ==0 && newHeight==0 && newWidth==0))
		{
			console.log('Returning the box itself');
			return [x,y,width,height];
			return null;
		}
		if (border!=0) {
			newWidth = width+border*2;
			newHeight= height+border*2;
		} 
		return [x+(width-newWidth)/2,y+(height-newHeight)/2,newWidth,newHeight];
	},

	//same as a enclosingBox but takes an array parameter [x,y,width,height]
	box_alignedBox2 : function (box,newWidth,newHeight,border) {
		return this.box_alignedBox(box[0],box[1],box[2],box[3],newWidth,newHeight,border);
	},

	//Returns a random triangle (three [x,y] points) contained in the given box.
	//Each vertex can have a distance up to 'tolerance' from the bounding box. Notice that distance 
	//is calculated from the side (or prolongement of it).
	//Tolerance is always considered inward.
	randomTriangle: function(x,y,width,height,tolerance,keepProportions) {
		if (typeof keepProportions == 'undefined') keepProportions=true;
		console.log('Draw triangle in '+x+','+y+','+width+','+height);
		const randomBox = this.box_alignedBox(x,y,width,height,null,null,-random.range(0,tolerance));
		//yes, the coordinates are completely arbitrary
		const p1=[random.range(0,1000),random.range(0,1000)];
		const p2=[random.range(0,1000),random.range(0,1000)];
		const p3=[random.range(0,1000),random.range(0,1000)];
		const triangle=[p1,p2,p3];
		return this.reboundLine(triangle,randomBox,keepProportions);
	},
	
	/** given a point p  ([x,y]) and another point o, moves p at distance targetDistance from o, on the same segment.
	*It returns the final point [x,y].
	*if you provide a distanceFactor different from zero, moves p at a distance equal to originalDistance*distanceFactor
	* @p first point [x,y], the one to be moved
	* @o the origin point [x,y]
	* @targetDistance the final distance of p from o (on the same p-o vector)
	* @distanceFactor (overrides target distance) see description
	*/
	respatiatePoint: function (p,o,targetDistance,distanceFactor) {
		if (typeof distanceFactor == 'undefined' || distanceFactor == null || distanceFactor==0)  {
			distanceFactor = targetDistance/this.pointsDistance(p,o);
		}
		return [(p[0]-o[0])*distanceFactor+o[0],(p[1]-o[1])*distanceFactor+o[1]];
	},
		
	/**
	* "Reflects" the point horizontally, in respect to a vertical line set at X 
	* @p the point [x,y]
	* @x the horizontal mirroring position
	*/
	reflectPointH: function (p,x) {
		return this.respatiatePoint(p,[x,p[1]],0,-1);
	},

	pointsDistance: function(p1,p2) {
		const dx = p2[0]-p1[0];
		const dy = p2[1]-p1[1];
		return Math.sqrt(dx*dx + dy*dy);
	},
	
	/**
	* Translates polar coordinates to radial.
	* @radius
	* @azimuth clockwise, polar axis is the "x" direction
	* @origin the [x,y] array of the origin in cartesian coordinates
	* returns : the [x,y] point
	*/
	ptc: function(radius,azimuth,origin) {
		if (!Array.isArray(origin)) alert('Polar to Coordinates : origin is not an array');
		return [origin[0]+radius*Math.cos(azimuth),origin[1]+radius*Math.sin(azimuth)];
	},
	
	//TODO i need these function:
	// - line passing for two points
	// angle between three points
	// smooth bezier between two points

	//Given a line, resizes it so the bounding box ([x,y,w,h]) is the provided one.
	//If keepProportions is false the new line will be resized to 'fill' the box
	//If keepProportions is true , the new line will mantain its aspect 
	//It returns a NEW line.
	reboundLine : function (line,containerBox, keepProportions) {
		console.log('Container = '+containerBox);
		const bounds = geometry.getBounds(line);
		const currentBoundingBox =this.box_pointArrayToWh(bounds);
		console.log('Bounding = '+currentBoundingBox);
		if (keepProportions) {
			ratio = currentBoundingBox[2]/currentBoundingBox[3]; //e.g. 1,5 
			//keep same width
			let newY = containerBox[2]/ratio;
			if (newY<containerBox[3]) {
				containerBox = this.box_alignedBox2(containerBox,containerBox[2],newY,null);
			} else {
				//keep same height
				let newX = containerBox[3]*ratio;
				containerBox = this.box_alignedBox2(containerBox,newX,containerBox[3],null);
			}
			
				
			
		}
		const resultLine = [];
			for (let i=0; i<line.length;i++) {
				resultLine.push([
				containerBox[0]+(containerBox[2] * (line[i][0]-currentBoundingBox[0])/currentBoundingBox[2]),
				containerBox[1]+containerBox[3] * (line[i][1]-currentBoundingBox[1])/currentBoundingBox[3]
				]);
			}		
		return resultLine;
	}

}

exports.klib = kyobalib;