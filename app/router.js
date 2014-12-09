var pages = [
	"index",
	"login",
	"logout",
	"register",
	"about",
	"updates",
	"scoreboard"
];

var auth_pages = [
];

for(var i=0; i<auth_pages.length; i++) {
	pages.push(auth_pages[i]);
}

module.exports = function(app) {
	for(var i=0; i<pages.length; i++) {
		(function(i) {
			app.get("/" + pages[i], function(req, res) {
				if (auth_pages.indexOf(pages[i]) > -1) {
					// TODO Redirect to login page.
					return;
				} else {
					res.sendfile("pages" + req.url + ".html", { root: __dirname });
				}
			});
		})(i);
	}
};