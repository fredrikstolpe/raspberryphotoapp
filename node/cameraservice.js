var config = require("configure");
var q = require("q");
var moment = require("moment");
var child_process = require("child_process");

var self = this;
self.cameraBusy = false;

module.exports = {
	takePhoto : function(){
		var deferred = q.defer();
		if (self.cameraBusy){
			deferred.reject("Camera busy");
		}
		else{
			self.cameraBusy = true;
			var filename = moment().format("YYYYMMDDHHmmss-SSS.jpg");
			var path = config.imageFolder + "/" + filename;
			child_process.exec("raspistill -w " + config.image.width + "  -h " + config.image.height + " -q " + config.image.quality + " -o '" + path + "'", function(error, stdout, stderr){
				self.cameraBusy = false;
				if (error){
					deferred.reject(error);
				}
				else{
					deferred.resolve(filename);
				}
			})
		}
		return deferred.promise;
	}
}
