var account = require("./account");
var auth = require("./auth");
var forgot = require("./forgot");
var scoreboard = require("./scoreboard");

module.exports = function(app) {
	app.get("/api", function(req, res) {
		res.send({ message: "The API is working.", });
	});

	// ********
	//   AUTH
	// ********
	app.get("/api/auth/authorized", function(req, res) {
		auth.is_authorized(req, res);
	});
	app.get("/api/auth/loggedin", function(req, res) {
		auth.is_logged_in(req, res);
	});
	app.post("/api/auth/login", function(req, res) {
		auth.login(req, res);
	});
	app.get("/api/auth/logout", function(req, res) {
		auth.logout(req, res);
	});

	// ***********
	//   ACCOUNT
	// ***********
	app.post("/api/account/register", function(req, res) {
		account.register(req, res);
	});

	// **************
	//   SCOREBOARD
	// **************
	app.get("/api/scoreboard", function(req, res) {
		scoreboard.get_scoreboard(req, res);
	});
	app.get("/api/scoreboard/graph", function(req, res) {
		scoreboard.get_graph(req, res);
	});

	// *******************
	//   FORGOT PASSWORD
	// *******************
	app.post("/api/forgot", function(req, res) {
		forgot.send_reset_email(req, res);
	});
	app.post("/api/forgot/reset", function(req, res) {
		forgot.verify_code(req, res);
	});
};