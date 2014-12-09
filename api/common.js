// ************
//   INCLUDES
// ************

var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;

// ************
//   DATABASE
// ************

// REPLACE THE FOLLOWING WITH YOUR DATABASE INFORMATION
exports.db = new MongoDB("ctf", new Server("localhost", 27017, { auto_reconnect: true }), { w: 1 });

// REPLACE THE FOLLOWING WITH YOUR OWN CREDENTIALS
exports.db.open(function(err, database) {
	if (err) {
		console.log("[api/common.js] error connecting to database");
		console.dir(err);
	} else {
		console.log("[api/common.js] connected to database");
		database.authenticate("admin", "password", function(err2, result) {
			if (err2) {
				console.log("[api/common.js] error authenticating to database");
				console.dir(err2);
			} else {
				console.log("[api/common.js] authenticated to database");
			}
		});
	}
});