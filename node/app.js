var express = require("express");
var config = require("configure");
var camera = require("./picamera.js");
var glitcher = require("./imageglitcher.js");
var imHelper = require("./imhelper.js");

var fs = require("fs");

//var gpio = require("node-gpio");

var app = express();

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

app.get('/takephoto', function (req, res) {
	camera.takePhoto(config.image.width, config.image.height, config.image.quality, config.imageFolder)
	.then(
		function(value){
			console.log(value);
			res.send(value);
		},
		function(error){
			console.log(error);
			res.send(error);
		}
	)
});

app.get('/glitchphoto/:filename', function (req, res) {
	console.log("Service glitchphoto");
	glitcher.
	randomHorizontalRegionRoll(req.params.filename, imHelper.fileNameAppend(req.params.filename, "_g"), config.imageFolder)
	.then(
	  function(value){
      console.log(value);
      res.send(value);
	  },
	  function(error){
      console.log(error);
      res.send(error);
	  }
	)
});

app.get('/splitchannels/:filename', function (req, res) {
	var fileName = req.params.filename;
	glitcher.
	splitChannel(fileName, imHelper.fileNameAppend(fileName, "_r"), config.imageFolder, "R")
	.then(function(result){
		console.log(result);
		return glitcher.splitChannel(fileName, imHelper.fileNameAppend(fileName, "_g"), config.imageFolder, "G");
	})
	.then(function(result){
		console.log(result);
		return glitcher.splitChannel(fileName, imHelper.fileNameAppend(fileName, "_b"), config.imageFolder, "B");
	})	
	.then(function(result){
		console.log(result);		
    res.send("Done!");		
	})
	.catch(function (error){
    res.send(error);
	})
});

app.get('/joinchannels/:filename', function (req, res) {
	var fileName = req.params.filename;
	glitcher.
	joinChannels(imHelper.fileNameAppend(fileName, "_r"), imHelper.fileNameAppend(fileName, "_g"), imHelper.fileNameAppend(fileName, "_b"), imHelper.fileNameAppend(fileName, "_rgb"), config.imageFolder)
	.then(function(result){
		console.log(result);		
    res.send("Done!");		
		})
	.catch(function (error){
    res.send(error);
	})
});

app.get('/addscanlines/:filename', function (req, res) {
	var fileName = req.params.filename;
	glitcher.
	addScanLines(fileName, imHelper.fileNameAppend(fileName, "_scan"), config.imageFolder)
	.then(function(result){
		console.log(result);		
    res.send("Done!");		
		})
	.catch(function (error){
    res.send(error);
	})
});

app.get("/latestphotos", function (req, res){
	fs.readdir(config.imageFolder, function(err, files){
		files.sort();
		files.reverse();
		files = files.slice(0, 20);
		files = files.map(function(file){
			return "/" + config.imageFolder + "/" + file;
		});
		res.json(files);
	});
});
/*
var button = new gpio.GPIO(config.pins.button);
button.open();
button.setMode(gpio.IN);
button.on("changed", function (value){
	if (value == 1){
		console.log("Button takephoto")
		camera.takePhoto(config.image.width, config.image.height, config.image.quality, config.imageFolder)
  	.then(
			function(value){
      	console.log(value);
    	},
    	function(error){
      	console.log(error);
    	}
  	)
	}
});
button.listen();
*/
app.listen(80);
console.log("Up and running");
