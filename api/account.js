var common = require("./common");
var moment = require("moment");

exports.register = function(req, res) {
	var email = req.param("email");
	var teamname = req.param("team");
	var school = req.param("school");
	var pwd = req.param("pass");

	if (!(email && email.length > 0 && teamname && teamname.length > 0 && school && school.length > 0 && pwd && pwd.length > 0)) {
		res.send({
			success: 0,
			message: "Please fill out all of the required fields."
		});
		return;
	}

	teamname = common._(teamname);
	school = common._(school);

	if (teamname.length == 0) {
		res.send({
			success: 0,
			message: "Please enter some characters."
		});
		return;
	}

	if (teamname.length > common.TEAMNAME_MAX_CHARS) {
		res.send({
			success: 0,
			message: "STAHP PLS"
		});
		return;
	}

	if (!teamname.match(common.ASCII)) {
		res.send({
			success: 0,
			message: "Please enter ascii characters only."
		});
		return;
	}

	if (school.length == 0) {
		res.send({
			success: 0,
			message: "Please enter some characters."
		});
		return;
	}

	if (school.length > common.TEAMNAME_MAX_CHARS) {
		res.send({
			success: 0,
			message: "STAHP PLS"
		});
		return;
	}

	if (!school.match(common.ASCII)) {
		res.send({
			success: 0,
			message: "Please enter ascii characters only."
		});
		return;
	}

	common.db.collection("accounts").find({
		$or: [
			{ teamname: teamname },
			{ email: email }
		]
	}).count(function(err, count) {
		if (count != 0) {
			res.send({
				success: 0,
				message: "That team name or email is already registered."
			});
			return;
		} else {
			console.log("[api/accounts.js] inserting account");
			common.db.collection("accounts").insert({
				email: email.toString(),
				teamname: teamname.toString(),
				school: school.toString(),
				pass: common.encryptPass(pwd.toString()),
				group: 1,
				registerDate: moment().format()
			}, { w: 1 }, function(err, inserted) {
				console.dir(inserted);
				console.log("[api/account.js] inserted.");
				res.send({
					success: 1,
					message: "Yay! You just registered!"
				});
				return;
			});
		}
	});
};