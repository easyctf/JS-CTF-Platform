var common = require("./common");
var moment = require("moment");
require("dotenv").load();

// THIS INFO GOES INTO A .env FOLDER OR YOU CAN PROVIDE IT AS ENVIRONMENTAL VARIABLES ON YOUR HOST
var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

// *************
//   CONSTANTS
// *************
// change this stuff
var FROM_EMAIL = "admin@yourctf.com";
var FROM_NAME = "Your CTF";
var DOMAIN = "yourctf.com";

exports.send_reset_email = function(req, res) {
	var email = req.param("email");

	if (!email) {
		res.send({
			success: 0,
			message: "You have to enter an email!",
		});
		return;
	}

	common.db.collection("accounts").find({
		email: email
	}).toArray(function(err, data) {
		if (err) {
			res.send({
				success: 0,
				message: "An internal error occurred."
			});
			return;
		}

		if (data.length == 0) {
			res.send({
				success: 0,
				message: "Couldn't find your email. Try signing up?"
			});
			return;
		}

		if (data.length > 1) {
			res.send({
				success: 0,
				message: ""
			});
			return;
		}

		var checkTeam = data[0];
		var salt = common.generateSalt();
		var code = common.hash(email+salt, "sha256") + salt;
		var expire = moment().add(48, "hours");

		// deactivate existing codes for this email
		common.db.collection("reset_password").update({
			email: email,
			active: true
		}, {
			$set: {
				active: false
			}
		}, function(err2, data2) {
			// insert a request
			common.db.collection("reset_password").insert({
				code: code,
				email: email,
				salt: salt,
				expire: expire.format(),
				active: true
			}, { w: 1 }, function(err3, data3) {
				if (err3) {
					res.send({
						success: 0,
						message: "Couldn't make a password reset request."
					});
					return;
				}

				sendgrid.send({
					to: email,
					from: FROM_EMAIL,
					fromname: FROM_NAME,
					replyto: FROM_EMAIL,
					subject: "Password Reset Requested.",
					html: '<p>Hey there</p><p>Someone (hopefully you) requested to change the password for the account with the email ' + req.param('email') + '. Obviously, we\'ll be asking for verification of identity, so if you did in fact request this, follow this link: http://' + DOMAIN + '/forgot/' + code + "</p><p>" + FROM_NAME + "</p>"
				}, function(err4, json) {
					if (err4) {
						console.dir(err4);
						res.send({
							success: 0,
							message: "Failed to send email"
						});
						return;
					} else {
						res.send({
							success: 1,
							message: "Email successfully sent!"
						});
						return;
					}
				});
			});
		});
	});
};

exports.verify_code = function(req, res) {
	var code = req.param("code");
	var pass = req.param("p1");
	var confirm = req.param("p2");

	if (!(code && pass && confirm)) {
		res.send({
			success: 0,
			message: "You must fill out all of the fields!"
		});
		return;
	}

	if (pass !== confirm) {
		res.send({
			success: 0,
			message: "Passwords don't match."
		});
		return;
	}

	common.db.collection("reset_password").find({
		code: code,
		active: true
	}).toArray(function(err, data) {
		if (err) {
			res.send({
				success: 0,
				message: "Internal error.",
			});
			return;
		}
		if (data.length == 0) {
			res.send({
				success: 0,
				message: "Couldn't find an active ticket for this code. Try requesting another"
			});
			return;
		}

		var obj = data[0];
		var now = moment();
		var exp = moment(obj.expire);
		if (now.isBefore(exp) && obj.active) {
			var salted = common.encryptPass(pass); //yum
			common.db.collection("reset_password").update({
				code: code
			}, {
				$set: {
					active: false
				}
			}, function(err2, data2) {
				if (err2) {
					res.send({
						success: 0,
						message: "Internal error.",
					});
					return;
				}
				common.db.collection("accounts").update({
					email: obj.email
				}, {
					$set: {
						pass: salted
					}
				}, function(err3, data3) {
					if (err3) {
						res.send({
							success: 0,
							message: "Internal error.",
						});
						return;
					} else {
						res.send({
							success: 1,
							message: "Your password has been changed!"
						});
						return;
					}
				});
			});
		} else {
			res.send({
				success: 0,
				message: "Maybe your code expired?"
			});
			return;
		}
	});
}