var util = require("util");
var q = require("q");
var moment = require("moment");
var childProcess = require("child-process-promise");

var self = this;
self.cameraBusy = false;

module.exports = {
	takePhoto : function(width, height, quality, folderName){
		var deferred = q.defer();
		if (self.cameraBusy){
			deferred.reject("Camera busy");
		}
		else{
			self.cameraBusy = true;
			var filename = moment().format("YYYYMMDDHHmmss-SSS.jpg");
			var path = util.format("./%s/%s", folderName, filename);
			var command = util.format("raspistill -w %s -h %s -q %s -o %s -t 3000", width, height, quality, path);
			childProcess.exec(command)
			.then(
				function (result){
					self.cameraBusy = false;
					deferred.resolve(filename);
				},
				function (error){
					self.cameraBusy = false;
					deferred.reject(error);
				}
			)
		}
		return deferred.promise;
	}
}
