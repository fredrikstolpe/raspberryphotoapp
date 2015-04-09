var express = require("express");
var config = require("configure");
var camera = require("./picamera.js");
var request = require("request");

var fs = require("fs");

//var gpio = require("node-gpio");

var app = express();

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

app.get('/request', function(req, res){
	var r = request.post('http://localhost:8080/api/upload', function optionalCallback (err, httpResponse, body) {
	  if (err) {
	    return console.error('upload failed:', err);
	  }
	  console.log('Upload successful!  Server responded with:', body);
	})
	var form = r.form()
	form.append('my_field1', 'my_value23_321')
	form.append('my_field2', '123123sdas')
	form.append('my_file', fs.createReadStream(__dirname + '/koala.jpg'))
});

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
app.listen(config.port);
console.log("Up and running");
