var util = require("util");
var q = require("q");
var childProcess = require("child-process-promise");
var imCommandBuilder = require("./imcommandbuilder.js");
var imHelper = require("./imhelper.js");

module.exports = {
  randomHorizontalRegionRoll : function(inFileName, outFileName, folder){
    var deferred = q.defer();
    imHelper.getImageSize(imHelper.prependFolder(inFileName, folder))
    .then(
      function(dimensions){
        console.log("Image dimensions: " + dimensions.width + " x " + dimensions.height);
        var command = new imCommandBuilder.IMCommand("convert", imHelper.prependFolder(inFileName, folder), imHelper.prependFolder(outFileName, folder));
        for (var i = 0; i < 20; i++){
          command.addRandomRegion(0,Math.floor(dimensions.height/10),0,dimensions.height-Math.floor(dimensions.height/10));
          var rollWidth = Math.floor(dimensions.width/30);
          command.addRandomRoll(0-rollWidth,rollWidth,0,0);
        }
        imHelper.exec(command.render())
        .then(
          function(result){
            deferred.resolve(outFileName);
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

  splitChannel : function(inFileName, outFileName, folder, channel){
    var command = new imCommandBuilder.IMCommand("convert", imHelper.prependFolder(inFileName, folder), imHelper.prependFolder(outFileName, folder));
    command.addSeparateChannel(channel);
    return imHelper.exec(command.render(), outFileName);
  },

  joinChannels : function(inFileNameR, inFileNameG, inFileNameB, outFileName, folder){
    var fileNames = [imHelper.prependFolder(inFileNameR, folder), imHelper.prependFolder(inFileNameG, folder), imHelper.prependFolder(inFileNameB, folder)];
    var command = new imCommandBuilder.IMCommand("convert", fileNames, imHelper.prependFolder(outFileName, folder));
    command.addJoinChannels();
    return imHelper.exec(command.render(), outFileName);
  },

  addScanLines : function(inFileName, outFileName, folder){
    //var command = util.format("composite %s photos/scanlines.gif -compose darken %s", imHelper.prependFolder(inFileName, folder), imHelper.prependFolder(outFileName, folder));
    var command = util.format("composite %s photos/scanlines.gif -compose difference     %s", imHelper.prependFolder(inFileName, folder), imHelper.prependFolder(outFileName, folder));
    console.log(command);
    return imHelper.exec(command, outFileName);
  },

  turquoise : function(inFileName, outFileName, folder){
    var deferred = q.defer();
    inFilePath = imHelper.prependFolder(inFileName, folder)
    outFilePath = imHelper.prependFolder(outFileName, folder)
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
  
  red : function(inFileName, outFileName, folder){
    var deferred = q.defer();
    inFilePath = imHelper.prependFolder(inFileName, folder)
    outFilePath = imHelper.prependFolder(outFileName, folder)
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

  darken : function(inFileName, inFileName2, outFileName, folder){
    var deferred = q.defer();
    inFilePath = imHelper.prependFolder(inFileName, folder)
    inFilePath2 = imHelper.prependFolder(inFileName2, folder)
    outFilePath = imHelper.prependFolder(outFileName, folder)
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
