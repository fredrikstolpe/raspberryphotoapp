var util = require("util");
var express = require("express");
var http = require('http');
var config = require("configure");
var camera = require("./picamera.js");
var fileUpload = require("./fileupload.js");
var path = require('path');
var fs = require("fs");
var gpio = require("node-gpio");

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('messagePress button to take a photo');
  	socket.on('disconnect', function(){
    		console.log('user disconnected');
 	});
});

app.use(express.static(path.join(__dirname, 'public')));

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

app.get('/upload', function(req, res){
	fileUpload.uploadFile(util.format("./%s/%s", config.imageFolder, 'diva.png'))
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
			return fileUpload.uploadFile(util.format("./%s/%s", config.imageFolder, filename));
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

var button = new gpio.GPIO(config.pins.button);
button.open();
button.setMode(gpio.IN);
button.on("changed", function (value){
	if (value == 1){
		console.log("Button takephoto")
		io.emit('message', '3');
		setTimeout(
			function(){
				io.emit('message', '2');
				setTimeout(
					function(){
						io.emit('message', '1');
						setTimeout(
							function(){
								io.emit('message', 'SMILE!');
							}
							, 1000
						);
					}
					, 1000
				);
			}
			, 1000
		);
		camera.takePhoto(config.image.width, config.image.height, config.image.quality, config.imageFolder)
  		.then(
			function(filename){
      				console.log("val " + value);
				io.emit('message', 'Uploading...');
				return fileUpload.uploadFile(util.format("./%s/%s", config.imageFolder, filename));
    			}
  		)
		.then(
			function(result){
				io.emit('message', 'Upload done ' + result);
				console.log(result)
			}
		)
		.fail(
			function (error) {
				io.emit('message', 'Upload failed :-(');
    				console.log(error);
			}
		);
	}
});
button.listen();

server.listen(config.port);
console.log("Up and running on port " + config.port);
