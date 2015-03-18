var util = require("util");
var q = require("q");
var child_process = require("child_process");

var self = this;

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function geometry(width, height, left, top) {
  return util.format("%sx%s+%s+%s", width, height, left, top);
}

function region(geometry) {
  return util.format("-region %s", geometry);
}

function randomRegion(width, height, left, top){
  var width = (width == 0) ? 0 : randomInt(0,width);
  var height = (height == 0) ? 0 : randomInt(0,height);
  var left = (left == 0) ? 0 : randomInt(0,left);
  var top = (top == 0) ? 0 : randomInt(0,top);
  return util.format("-region %s", geometry(width, height, left, top));
}

function randomRoll(left, top, negative){
  if(negative){
    left += left;
    top += top;
  }
  var rndLeft = (left == 0) ? 0 : randomInt(0,left);
  var rndTop = (top == 0) ? 0 : randomInt(0,top);
  if(negative){
    rndLeft -= left;
    rndTop -= top;
  }
  rndLeft = (rndLeft < 0) ? "" + rndLeft : "+" + rndLeft;
  rndTop = (rndTop < 0) ? "" + rndTop : "+" + rndTop;
  return util.format("-roll %s%s", rndLeft, rndTop);
}

function executeCommand(command){
  console.log("-> " + command);
  var deferred = q.defer();
  child_process.exec(command, function(error, stdout, stderr){
    if (error){
      deferred.reject(error);
    }
    else{
      deferred.resolve(stdout);
    }
  });
  return deferred.promise;   
}

module.exports = {

  glitch1 : function(inFilePath, outFilePath){
    var deferred = q.defer();
    var command = util.format("convert %s -region x233+0+100 -roll +40+0 %s", inFilePath, outFilePath);
    executeCommand(command)
    .then(
      function(result){
        deferred.resolve(outFilePath);
      },
      function(error){
        deferred.reject(error);
      }
    );
    return deferred.promise;
  },

  turquoise : function(inFilePath, outFilePath){
    var deferred = q.defer();
    var command = util.format("convert %s -colorspace Gray -lat 50x50 -black-threshold 50% -fill turquoise1 -opaque black %s", inFilePath, outFilePath);
    executeCommand(command)
    .then(
      function(result){
        deferred.resolve(outFilePath);
      },
      function(error){
        deferred.reject(error);
      }
    );
    return deferred.promise;
  },
  
  red : function(inFilePath, outFilePath){
    var deferred = q.defer();
    var command = util.format("convert %s -colorspace Gray -lat 50x50 -black-threshold 50% -fill red2 -opaque black %s", inFilePath, outFilePath);
    executeCommand(command)
    .then(
      function(result){
        deferred.resolve(outFilePath);
      },
      function(error){
        deferred.reject(error);
      }
    );
    return deferred.promise;
  },  

  darken : function(inFilePath, inFilePath2, outFilePath){
    var deferred = q.defer();
    var command = util.format("composite %s %s -compose darken %s", inFilePath, inFilePath2, outFilePath);
    executeCommand(command)
    .then(
      function(result){
        deferred.resolve(outFilePath);
      },
      function(error){
        deferred.reject(error);
      }
    );
    return deferred.promise;
  },  
  
  glitch2 : function(inFilePath, outFilePath){
    var deferred = q.defer();
    var imageSize = this.getImageSize(inFilePath)
    .then(
      function(dimensions){
        var commands = [];
        for (var i = 0; i < 10; i++){
          var regionRoll = util.format("%s %s", randomRegion(0,dimensions.height,0,Math.floor(dimensions.height/30)), randomRoll(Math.floor(dimensions.width/30),0,true));
          commands.push(regionRoll);
        }
        var command = util.format("convert %s %s %s", inFilePath, commands.join(" "), outFilePath);
        executeCommand(command)
        .then(
          function(result){
            deferred.resolve(outFilePath);
          },
          function(error){
            deferred.reject(error);
          }
        );
      },
      function(error){
        deferred.reject(error);
      }
    )
    /*var command = util.format("convert %s -region x233+0+100 -roll +40+0 %s", inFilePath, outFilePath);
    executeCommand(command)
    .then(
      function(result){
        deferred.resolve(outFilePath);
      },
      function(error){
        deferred.reject(error);
      }
    );
    */
    return deferred.promise;
  },  
  
  getImageSize : function(filePath){
    var deferred = q.defer();
    var command = util.format("identify %s", filePath);
    executeCommand(command)
    .then(
      function(result){
        var output = result.split(" ");
        if (output.length >= 2){
          var wh = output[2].split("x");
          deferred.resolve({width:parseInt(wh[0]),height:parseInt(wh[1])});
        }
        deferred.reject("Could not read image size");
      },
      function(error){
        deferred.reject(error);
      }
    );
    return deferred.promise;
  }

}
