var util = require("util");

//Private

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

function randomLeftTop(minLeft, maxLeft, minTop, maxTop) {
	var result = leftTop(randomInt(minLeft, maxLeft),randomInt(minTop, maxTop));
  //console.log("randomLeftTop: " + result);
  return result;
}

function geometry(width, height, left, top) {
  return util.format("%sx%s%s", width, height, leftTop(left, top));
}

function randomGeometry(maxWidth, maxHeight, maxLeft, maxTop){
  var result = geometry(randomInt(0, maxWidth), randomInt(0, maxHeight), randomInt(0, maxLeft), randomInt(0, maxTop));
  console.log("randomGeometry: " + result);
  return result;
}

//IMCommand

function IMCommand(command, inFileName, outFileName){
  this.command = command;
  this.inFileName = inFileName;
  this.outFileName = outFileName;
  this.commands = [];
}

IMCommand.prototype.render = function(){
  return this.command + " " + this.inFileName + " " + this.commands.join(" ") + " " + this.outFileName;
}

IMCommand.prototype.addRegion = function(width, height, left, top){
  this.commands.push(util.format("-region %s", geometry(width, height, left, top)));
}

IMCommand.prototype.addRandomRegion = function(maxWidth, maxHeight, maxLeft, maxTop){
  this.commands.push(util.format("-region %s", randomGeometry(maxWidth, maxHeight, maxLeft, maxTop)));
}

IMCommand.prototype.addRoll = function(left, top){
  this.commands.push(util.format("-roll %s", leftTop(left, top)));
}

IMCommand.prototype.addRandomRoll = function(minLeft, maxleft, minTop, maxTop){
  this.commands.push(util.format("-roll %s", randomLeftTop(minLeft, maxleft, minTop, maxTop)));
}

//Export

module.exports = {
  IMCommand : IMCommand
}