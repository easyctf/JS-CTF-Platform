// ***************************************
// *                                     *
// *      EasyCTF 2014 CTF-Platform      *
// *                                     *
// ***************************************

var express = require("express");
var http = require("http");

var app = express();

app.configure(function() {
	app.set("port", process.env.PORT || 3000);

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "replace-this-secret"
	}));

	app.use(express.static(__dirname + "/web"));
});

http.createServer(app).listen(app.get("port"), function() {
	console.log("[app.js] listening on port " + app.get("port") + "...");
});