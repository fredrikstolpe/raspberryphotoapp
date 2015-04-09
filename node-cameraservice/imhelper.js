var util = require("util");
var q = require("q");
var childProcess = require("child-process-promise");

module.exports = {

  getImageSize : function(filePath){
    var deferred = q.defer();
    var command = util.format("identify %s", filePath);
    childProcess.exec(command)
    .then(
      function(result){
        var output = result.stdout.split(" ");
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
  },

  fileNameAppend : function(fileName, append){
    var split = fileName.split(".");
    return split[0] + append + "." + split[1];
  },

  prependFolder : function(fileName, folderName){
    return folderName + "/" + fileName;
  },

  exec : function(command, outFileName){
    console.log("Exec: " + command);
    var deferred = q.defer();
    
    childProcess
    .exec(command)
    .then(
      function(result){
        deferred.resolve(outFileName);
      },
      function(error){
        deferred.reject(error);        
      }
    );
    
    return deferred.promise;
  }
}