var util = require("util");
var express = require("express");
var http = require('http');
var config = require("configure");
var camera = require("./picamera.js");
var fileUpload = require("./fileupload.js");
var path = require('path');
var fs = require("fs");
var q = require("q");
var Gpio = require("onoff").Gpio;
var led = new Gpio(config.pins.led, 'out');
var button = new Gpio(config.pins.button, 'in', 'both');

function exit(){
	led.unexport();
	button.unexport();
	process.exit();
}

var busy = false;

process.on('SIGINT', exit);

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('message', 'Press button');
  	socket.on('disconnect', function(){
    		console.log('user disconnected');
 	});
});

app.use(express.static(path.join(__dirname, 'public')));

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

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

led.writeSync(1);

button.watch(
	function (err, value){
		if (value == 1 && !busy){
			busy = true;
			led.writeSync(0);
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
									io.emit('message', 'POSE!');
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
					io.emit('image', util.format("/%s/%s", config.imageFolder, filename));
					return fileUpload.uploadFile(util.format("./%s/%s", config.imageFolder, filename));
	    			}
	  		)
			.then(
				function(result){
					busy = false;
					if (result.success){
					}
					led.writeSync(1);
					io.emit('message', 'Upload done ' + result);
					console.log(result);
					q.resolve();
				}
			)
			.fail(
				function (error) {
					io.emit('message', 'Upload failed :-(');
	    				console.log(error);
				}
			);
		}
	}
);

server.listen(config.port);
console.log("Up and running on port " + config.port);
