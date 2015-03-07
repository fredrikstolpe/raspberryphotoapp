var express = require("express");
var config = require("configure");
var raspicam = require("raspicam");
var cameraService = require("./cameraservice.js");

var app = express();

app.use(function(){
    app.use(express.static(__dirname + '/images'));
});

app.get('/api', function (req, res) {
  res.send('API is running');
});

app.get('/takephoto', function (req, res) {
	cameraService.takePhoto()
	.then(
		function(value){
			res.send('Done');
		},
		function(error){
			res.send('Failed');
		}
	)
});

app.listen(80);
console.log("Up and running");
