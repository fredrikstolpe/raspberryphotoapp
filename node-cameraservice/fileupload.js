var config = require("configure");
var q = require("q");
var request = require("request");

module.exports = {
	uploadFile : function(filePath){
		var deferred = q.defer();
		var r = request.post('http://localhost:8080/api/upload', function optionalCallback (err, httpResponse, body) {
		  if (err) {
		    deferred.reject(err);
		  }
		  deferred.resole(body);
		})
		var form = r.form()
		form.append('image', fs.createReadStream(filePath))		
		return deferred.promise;
	}
}
