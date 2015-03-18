var util = require("util");

function randomInt(low, high) {
		if (low == high)
			return low;
    return Math.floor(Math.random() * (high - low) + low);
}

function leftTop(left, top) {
  left = (left < 0) ? "" + left : "+" + left;
  top = (top < 0) ? "" + top : "+" + top;
  return util.format("%s%s", left, top);
}

//Todo: minleft mintop
function randomLeftTop(maxLeft, maxTop) {
	return leftTop(randomInt(0, maxLeft),randomInt(0, maxTop));
}

function geometry(width, height, left, top) {
  return util.format("%sx%s%s", width, height, leftTop(left, top);
}

function randomGeometry(maxWidth, maxHeight, maxLeft, maxTop){
  return geometry(randomInt(0, maxWidth), randomInt(0, maxHeight), randomInt(0, maxLeft), randomInt(0, maxTop));
}

module.exports = {
  commands : [],
  region : function(width, height, left, top){
  	commands.push(util.format("-region %s", geometry(width, height, left, top)));
  },
  randomRegion : function(maxWidth, maxHeight, maxLeft, maxTop){
  	commands.push(util.format("-region %s", randomGeometry(maxWidth, maxHeight, maxLeft, maxTop)));
  },
  roll : function(left, top){
  	commands.push(util.format("-roll %s", leftTop(left, top)));
  },
  randomRoll : function(maxleft, maxTop){
  	commands.push(util.format("-roll %s", randomLeftTop(maxleft, maxTop)));
  },  
  getCommands : function(){
  	return commands.join(" ");
  }  
}
