var http = require('http');
var q = require("q");
var config = require("configure");

console.log(config.serviceBaseUrl);

module.exports = {
	glitchPhoto : function (id){
		console.log(id);
		var deferred = q.defer();
		var options = {
		  host: config.serviceBaseUrl,
		  port: config.servicePort,
		  path: '/glitchphoto/' + id
		};
		http.get(options,function(res){
				console.log("Res");
			var responseString = "";
			res.on('data', function(data) {
			      responseString += data;
			});
	
			res.on('end', function() {
				console.log(responseString);
				var responseObject = JSON.parse(responseString);
				deferred.resolve(responseObject);
			});
		});
		return deferred.promise;
	}
}
