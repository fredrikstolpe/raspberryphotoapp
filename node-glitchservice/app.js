var express = require("express");
var config = require("configure");
var glitcher = require("./imageglitcher.js");
var imHelper = require("./imhelper.js");
var multer = require('multer');
var fs = require("fs");
var path = require('path');

var done=false;

var app = express();
app.use(multer({
	dest: './uploads/',
	rename: function (fieldname, filename) {
 	 return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
	},
	onFileUploadStart: function (file) {
  	console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
	  done=true;
	}
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

app.post('/api/upload',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
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

app.listen(config.port);
console.log("Up and running");
