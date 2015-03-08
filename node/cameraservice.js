var config = require("configure");
var q = require("q");
var moment = require("moment");
var child_process = require("child_process");

module.exports = {
	takePhoto : function(){
		var deferred = q.defer();
		var filename = moment().format("YYYYMMDDHHmmss-SSS.jpg");
		var path = config.imageFolder + "/" + filename;
		child_process.exec("raspistill -w " + config.image.width + "  -h " + config.image.height + " -q " + config.image.quality + " -o '" + path + "'", function(error, stdout, stderr){
			console.log('Child Process STDOUT: '+stdout);
			console.log('Child Process STDERR: '+stderr);
			if (error){
				deferred.reject(error);
			}
			else{
				deferred.resolve(filename);
			}
		})
		return deferred.promise;
	}
}
