var util = require("util");
var q = require("q");
var childProcess = require("child-process-promise");
var imCommandBuilder = require("./imcommandbuilder.js");
var imHelper = require("./imhelper.js");

module.exports = {
  randomHorizontalRegionRoll : function(inFilePath, outFilePath){
    var deferred = q.defer();
    imHelper.getImageSize(inFilePath)
    .then(
      function(dimensions){
        console.log("Image dimensions: " + dimensions.width + " x " + dimensions.height);
        var command = new imCommandBuilder.IMCommand("convert", inFilePath, outFilePath);
        for (var i = 0; i < 20; i++){
          command.addRandomRegion(0,Math.floor(dimensions.height/10),0,dimensions.height-Math.floor(dimensions.height/10));
          var rollWidth = Math.floor(dimensions.width/30);
          command.addRandomRoll(0-rollWidth,rollWidth,0,0);
        }
        imHelper.exec(command.render())
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
    return deferred.promise;
  },

  turquoise : function(inFilePath, outFilePath){
    var deferred = q.defer();
    var command = util.format("convert %s -colorspace Gray -lat 50x50 -black-threshold 50% -fill turquoise1 -opaque black %s", inFilePath, outFilePath);
    childProcess.exec(command)
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
    childProcess.exec(command)
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
    childProcess.exec(command)
    .then(
      function(result){
        deferred.resolve(outFilePath);
      },
      function(error){
        deferred.reject(error);
      }
    );
    return deferred.promise;
  }
}
