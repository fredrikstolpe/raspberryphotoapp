var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/glitchservice.db');
var q = require("q");

module.exports = {
	insertImage : function(fileName){
		var deferred = q.defer();
		db.serialize(function(){
			var stmt = db.prepare("INSERT INTO uploadedImages (fileName) VALUES(?)");
			stmt.run(fileName); 
			stmt.finalize();
			var stmt = "select seq from sqlite_sequence where name = 'uploadedImages'";
			db.all(stmt, function(err, rows) {
				deferred.resolve(rows[0]['seq']);
			});
  	});
    return deferred.promise;
	},
	getImage : function(id){
		var deferred = q.defer();
		var stmt = "SELECT * from uploadedImages where id = " + id;
		db.all(stmt, function(err,rows){
			if (rows.length > 0 && rows[0].fileName != null){
				deferred.resolve(rows[0].fileName);
			}
			else{
				deferred.resolve("File not found");				
			}
		});
    return deferred.promise;
	}
}