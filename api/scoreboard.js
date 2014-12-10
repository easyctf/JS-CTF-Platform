var common = require("./common");
var fs = require("fs");
var async = require("async");
var moment = require("moment");

var SCOREBOARD_PATH = "/static/scoreboard.html";

exports.get_scoreboard = function(req, res) {
	generate_scoreboard();
	res.sendfile(SCOREBOARD_PATH, { root: __dirname });
};

var generate_scoreboard = function() {

};