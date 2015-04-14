var util = require("util");
var express = require("express");
var config = require("configure");
var camera = require("./picamera.js");
var fileUpload = require("./fileupload.js");

var fs = require("fs");

//var gpio = require("node-gpio");

var app = express();

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

app.get('/upload', function(req, res){
	fileUpload.uploadFile(util.format("%s/%s", config.folderName, 'diva.png'))
	.then(
		function(value){
			res.send(value);
		},
		function(error){
			res.send(error);
		}
	)
});

app.get('/takephoto', function (req, res) {
	camera.takePhoto(config.image.width, config.image.height, config.image.quality, config.imageFolder)
	.then(
		function(filename){
			return fileUpload.uploadFile(util.format("%s/%s", config.folderName, filename));
		}
	)
	.then(
		function(result){
			res.send(result)
		}
	)
	.fail(
		function (error) {
    	res.send(error);
		}
	);
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
app.listen(config.port);
console.log("Up and running on port " + config.port);
