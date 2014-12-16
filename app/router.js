var http = require("http");
var moment = require("moment");
var auth = require("./../api/auth");
var common = require("./../api/common");

var pages = [
	"index",
	"login",
	"logout",
	"register",
	"about",
	"updates",
	"scoreboard",
	"forgot",
	"chat"
];

var auth_pages = [
	"problems"
];

var auth_pages_allowed = [
	"account"
];

for(var i=0; i<auth_pages.length; i++) {
	pages.push(auth_pages[i]);
}

for(var i=0; i<auth_pages_allowed.length; i++) {
	pages.push(auth_pages_allowed[i]);
}

module.exports = function(app) {
	app.get("/teapot", function(req, res) {
		res.status = 418;
		res.sendfile("app/pages/teapot.html");
	});

	for(var i=0; i<pages.length; i++) {
		(function(i) {
			app.get("/" + pages[i], function(req, res) {
				console.log("[app/router.js] GET "+req.url);
				if (auth_pages.indexOf(pages[i]) > -1) {
					if (!req.session.tID) {
						console.log("[app/router.js] not authorized for "+pages[i]+"!");
						res.redirect(301, "/login");
						return;
					} else {
						if (!(moment().isAfter(common.startDate) || req.session.group == 3)) {
							console.log("[app/router.js] competition hasn't started yet!");
							res.redirect(301, "/account");
							return;
						}
					}
				} else if (auth_pages_allowed.indexOf(pages[i]) > -1) {
					if (!req.session.tID) {
						console.log("[app/router.js] not authorized for "+pages[i]+"!");
						res.redirect(301, "/login");
						return;
					}
				}
				res.sendfile("pages" + req.url + ".html", { root: __dirname });
			});
		})(i);
	}

	app.get("/forgot/:code", function(req, res) {
		res.render("verify", {
			code: req.params.code
		});
	})
};