var config = require("configure");
var q = require("q");
var request = require("request");
var fs = require("fs");

module.exports = {
	uploadFile : function(filePath){
		var deferred = q.defer();
		var r = request.post(config.uploadUri, function optionalCallback (err, httpResponse, body) {
		  if (err) {
		    deferred.reject(err);
		  }
			var responseObject = JSON.parse(body);
		  deferred.resolve(responseObject);
		})
		var form = r.form()
		form.append('image', fs.createReadStream(filePath))		
		return deferred.promise;
	}
}
