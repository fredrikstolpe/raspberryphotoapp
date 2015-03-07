var q = require('q');

module.exports = {
	takePhoto : function(){
		var deferred = q.defer();
		deferred.resolve();
		return deferred;
	}
}
