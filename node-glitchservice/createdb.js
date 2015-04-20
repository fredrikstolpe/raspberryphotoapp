var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/glitchservice.db');

db.serialize(function() {
	db.run("CREATE TABLE if not exists uploadedImages (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, fileName varchar(255), glitchedFileName varchar(255), last_updated datetime default current_timestamp)");
});

db.close();
