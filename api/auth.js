var moment = require("moment");
var common = require("./common");

exports.is_logged_in = function(req, res) {
	if (req.session.tid) {
		res.send({
			success: 1,
			message: "You are logged in."
		});
		return;
	} else {
		if (req.cookies.teamname && req.cookies.password) {
			authenticate(req.cookies.teamname, req.cookies.password, true, function(result) {
				res.send(result);
				return;
			});
		} else {
			res.send({
				success: 0,
				message: "You are not logged in."
			});
			return;
		}
	}
};

exports.is_authorized = function(req, res) {
	if (req.session.tid) {
	} else {
		if (req.cookies.teamname && req.cookies.password) {
			authenticate(req.cookies.teamname, req.cookies.password, true, function(result) {
				if (result.success == 1) {
				} else {
					res.send(result);
					return;
				}
			});
		} else {
			res.send({
				success: 0,
				message: "You are not logged in."
			});
			return;
		}
	}
	if ((moment().isAfter(common.startDate) && moment().isBefore(common.endDate)) || (req.session.group && req.session.group == 3)) {
		res.send({
			success: 1,
			message: "You are authorized."
		});
		return;
	} else {
		res.send({
			success: 0,
			message: "You are not authorized."
		});
		return;
	}
};

exports.login = function(req, res) {
	if (req.param("teamname") && req.param("password")) {
		authenticate(req.param("teamname"), req.param("password"), false, function(result) {
			res.send(result);
			return;
		})
	} else {
		res.send({
			success: 0,
			message: "Please fill out all fields."
		});
		return;
	}
};

exports.logout = function(req, res) {
	if (req.session.tid) {
		req.session.destroy();
		req.session = null;
		res.send({
			success: 1,
			message: "Successfully logged out!"
		});
		return;
	} else {
		res.send({
			success: 0,
			message: "You're not logged in."
		});
		return;
	}
};

var authenticate = function(teamname, password, isHash, callback) {
	if (teamname == undefined || teamname == "") {
		callback({
			success: 0,
			message: "Team name cannot be empty."
		});
		return;
	}
	if (password == undefined || password == "") {
		callback({
			success: 0,
			message: "Password cannot be empty."
		});
		return;
	}
	if (teamname.length > common.TEAMNAME_MAX_CHARS) {
		callback({
			success: 0,
			message: "Team name is too long."
		});
		return;
	}

	common.db.collection("accounts").find({
		teamname: teamname
	}).toArray(function(err, array) {
		if (err) {
			console.log("[api/auth.js] error fetching accounts");
			console.dir(err);
			callback({
				success: 0,
				message: "Error fetching accounts."
			});
			return;
		} else {
			if (array.length == 0) {
				callback({
					success: 0,
					message: "Team was not found."
				});
				return;
			}
			if (array.length > 1) {
				callback({
					success: 0,
					message: "This error should never happen."
				});
				return;
			}

			var team = array[0];
			var pwHash = team.pass;

			if (isHash ? password == pwHash : common.validatePassword(password, pwHash)) {
				req.session.group = team.group || 1;
				req.session.tID = team._id.valueOf();
				res.cookie("teamname", teamname);
				res.cookie("password", pwHash);
				callback({
					success: 1,
					message: "Logged in."
				});
				return;
			} else {
				callback({
					success: 0,
					message: "Incorrect password"
				});
				return;
			}
		}
	});
};