// ***************************************
// *                                     *
// *      EasyCTF 2014 CTF-Platform      *
// *                                     *
// ***************************************

var express = require("express");
var http = require("http");
var api = require("./api/api");
var router = require("./app/router");
require("dotenv").load();

var app = express();

app.configure(function() {
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/app/jade");
	app.set("view engine", "jade");
	app.locals.pretty = true;

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.session({
		secret: process.env.APP_SECRET
	}));

	app.use(express.static(__dirname + "/web"));
});

api(app);
router(app);

http.createServer(app).listen(app.get("port"), function() {
	console.log("[app.js] listening on port " + app.get("port") + "...");
});