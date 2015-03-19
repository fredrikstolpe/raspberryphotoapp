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

  exec : function(command){
    return childProcess.exec(command);
  }

}