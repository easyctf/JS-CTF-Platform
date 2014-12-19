var account = require("./account");
var auth = require("./auth");
var common = require("./common");
var forgot = require("./forgot");
var problem = require("./problem");
var scoreboard = require("./scoreboard");

var moment = require("moment");

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

	// ************
	//   PROBLEMS
	// ************
	app.get("/api/problems", function(req, res) {
		authorized(req, res, function(result) {
			if (result.success == 1) {
				problem.load_problems(req.session.tid, function(problems) {
					res.send(problems);
				});
			} else {
				res.send({ success: 0, message: "You can't view this page!" });
			}
		});
	});
	app.post("/api/problems/submit", function(req, res) {
		authorized(req, res, function(result) {
			if (result.success == 1) {
				problem.submit_problem(req, function(result) {
					res.send(result);
				});
			} else {
				res.send({ success: 0, message: "You can't view this page!" });
			}
		});
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

var authorized = function(req, res, callback) {
	var checkAuth = function(req, callback) {
		if ((moment().isAfter(common.startDate) && moment().isBefore(common.endDate)) || (req.session.group && req.session.group == 3)) {
			callback({
				success: 1,
				message: "You are authorized."
			});
			return;
		} else {
			callback({
				success: 0,
				message: "You are not authorized."
			});
			return;
		}
	};
	if (req.session.tid) {
		checkAuth(req, callback);
	} else {
		if (req.cookies.teamname && req.cookies.password) {
			auth.authenticate(req, res, req.cookies.teamname, req.cookies.password, true, function(result) {
				if (result.success == 1) {
					checkAuth(req, callback);
				} else {
					callback(result);
					return;
				}
			});
		} else {
			callback({
				success: 0,
				message: "You are not logged in."
			});
			return;
		}
	}
};