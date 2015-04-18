var express = require("express");
var config = require("configure");
var glitcher = require("./imageglitcher.js");
var imHelper = require("./imhelper.js");
var multer = require('multer');
var fs = require("fs");
var path = require('path');
var dataService = require("./imagedataservice.js");

var app = express();

app.use(
	multer({
		dest: './' + config.uploadFolder + '/',
		rename: function (fieldname, filename) {
	 		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
		}
	})
);

app.use(express.static(path.join(__dirname, 'public')));

app.use("/" + config.imageFolder, express.static(__dirname + "/" + config.imageFolder));

app.use("/" + config.uploadFolder, express.static(__dirname + "/" + config.uploadFolder));

app.post('/api/upload',function(req,res){
  var file = req.files["image"];
  console.log(file);
  if (file != null){
  	dataService.insertImage(file.name)
  	.then(
  		function(imageId){
  			var response = { success : true, imageId : imageId };
  			res.send(response);
  		},
  		function(error){
  			var response = { success : false, error : error };
  			res.send(response);
  		}
		);
  }
  else{
		res.send({ success : false, error : "No file" });  	
  }
});

app.get('/test', function(req, res){
	res.send(req.headers.host);
});

app.get('/glitchphoto/:imageId', function (req, res) {
	console.log("Service glitchphoto");
	var fileName = "";
	dataService.getImage(req.params.imageId)
	.then(function(fileName){
		console.log(fileName);
		return glitcher.splitChannel(fileName, imHelper.fileNameAppend(fileName, "_r"), config.imageFolder, "R")
	})
	.then(function(result){
		console.log(result);
		return glitcher.splitChannel(fileName, imHelper.fileNameAppend(fileName, "_g"), config.imageFolder, "G");
	})
	.then(function(result){
		console.log(result);
		return glitcher.splitChannel(fileName, imHelper.fileNameAppend(fileName, "_b"), config.imageFolder, "B");
	})	
	.then(function(result){
		var response = { success : true, path : util.format("/%s/%s", config.uploadFolder, result) };
		res.send(response);
	})
	.catch(function (error){
		var response = { success : false, error : error };
		res.send(response);
	})
});

app.get('/glitchphotoxx/:imageId', function (req, res) {
	console.log("Service glitchphoto");
	dataService.getImage(req.params.imageId)
	.then(
		function(fileName){
  			var response = { success : true, fileName : fileName };
  			res.send(response);
		},
		function(error){
  			var response = { success : false, error : error };
  			res.send(response);
		}
	)

/*	glitcher.
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
	)*/
});

app.get('/glitchphotox/:filename', function (req, res) {
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

app.get('/bwglitch/:filename', function(req, res){
	glitcher.
	turquoise(req.params.filename, imHelper.fileNameAppend(req.params.filename, "_t"), config.imageFolder)
	.then(
		function(value){
			return glitcher.
			red(req.params.filename, imHelper.fileNameAppend(req.params.filename, "_r"), config.imageFolder)
		}
	)
	.then(
		function (value){
			return glitcher.
			randomHorizontalRegionRoll(imHelper.fileNameAppend(req.params.filename, "_t"),imHelper.fileNameAppend(req.params.filename, "_t"),config.imageFolder)
		}
	)
	.then(
		function (value){
			return glitcher.
			randomHorizontalRegionRoll(imHelper.fileNameAppend(req.params.filename, "_r"),imHelper.fileNameAppend(req.params.filename, "_r"),config.imageFolder)
		}
	)	
	.then(
		function (value){
			return glitcher.
			darken(imHelper.fileNameAppend(req.params.filename, "_t"),imHelper.fileNameAppend(req.params.filename, "_r"),imHelper.fileNameAppend(req.params.filename, "_g"),config.imageFolder)
		}
	)		
	.then(
		function(value){
      res.send(value);
		},
	  function(error){
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
console.log("Up and running on " + config.port);
