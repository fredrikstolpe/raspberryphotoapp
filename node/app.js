var express = require("express");
var config = require("configure");
var cameraService = require("./cameraservice.js");
var fs = require("fs");
var gpio = require("node-gpio");

var app = express();

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

app.get('/takephoto', function (req, res) {
	console.log("Service takephoto");
	cameraService.takePhoto()
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

var button = new gpio.GPIO(config.pins.button);
button.open();
button.setMode(gpio.IN);
button.on("changed", function (value) {
	if (value == 1)
	{
		console.log("Button takephoto")
		cameraService.takePhoto()
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

app.listen(80);
console.log("Up and running");
