var common = require("./common");
var fs = require("fs");
var async = require("async");
var moment = require("moment");

var SCOREBOARD_PATH = "/static/scoreboard.html";

exports.get_scoreboard = function(req, res) {
	generate_scoreboard();
	res.sendfile(SCOREBOARD_PATH, { root: __dirname });
};

exports.get_graph = function(req, res) {

};

var generate_scoreboard = function() {
	getTeamScores(function(teams) {
		var content = "";

		content += "<table class=\"table table-striped table-hover\" style=\"table-layout: fixed; width: 100%;\">\r\n";
		content += "\t<thead><tr>\r\n\t\t<th style=\"width:10%;\">Place</th>\r\n\t\t<th style=\"width:60%;\">Team</th>\r\n\t\t<th style=\"width:20%;\">School</th>\r\n\t\t<th style=\"width:10%;\">Score</th></tr></thead>\r\n";
		for(var i=0; i<teams.length; i++) {
			content += "\t<tr>\r\n";
			content += "\t\t<td>"+(i+1)+"</td>\r\n";
			content += "\t\t<td style=\"word-break:break-all;\">"+teams[i].teamname+"</td>\r\n";
			content += "\t\t<td style=\"word-break:break-all;\">"+teams[i].school+"</td>\r\n";
			content += "\t\t<td>"+teams[i].points+"</td>\r\n";
			content += "\t</tr>\r\n";
		}
		content += "</table>\r\n";

		fs.chmodSync(__dirname + SCOREBOARD_PATH, 0755);
		fs.writeFile(__dirname + SCOREBOARD_PATH, content, function(err) {
			if (err) {
				console.log("[api/scoreboard.js] error generating scoreboard");
			} else {
				console.log("[api/scoreboard.js] generated scoreboard");
			}
		});
	});
};

var generate_graph = function() {

};

var getTeamScores = function(callback) {
	common.db.collection("accounts").find({
		group: 1
	}).toArray(function(err, teams) {
		if (err) {
			console.log("[api/scoreboard.js] couldn't load accounts");
		} else {
			common.db.collection("submissions").find({
				correct: true,
			}).toArray(function(err2, submissions) {
				if (err2) {
					console.log("[api/scoreboard.js] couldn't load submissions");
				} else {
					common.db.collection("problems").find({
						value: {
							$gt: 0
						}
					}).toArray(function(err3, problems) {
						if (err3) {
							console.log("[api/scoreboard.js] couldn't load problems");
						} else {
							var teamArray = [];
							for(var i=0; i<teams.length; i++) {
								teams[i].lastUpdated = 0;
								var points = 0;
								for(var j=0; j<submissions.length; j++) {
									if (submissions[j]._id.valueOf().indexOf(teams[i]._id.valueOf()) > -1) {
										var time = moment(submissions[j].timestamp).diff(common.startDate);
										if (time > teams[i].lastUpdated) {
											teams[i].lastUpdated = time;
										}
										var prob_points;
										for(var k=0; k<problems.length; k++) {
											if(problems[k].pid == submissions[j].pid) {
												prob_points = problems[k].value;
												break;
											}
										}
										points += prob_points;
									}
								}
								teams[i].points = points;
							}

							teams.sort(function(a, b) {
								if (a.points > b.points) {
									return -1;
								}
								if (a.points < b.points) {
									return 1;
								}
								return a.lastUpdated - b.lastUpdated;
							});

							for(var i=0; i<teams.length; i++) {
								teamArray.push({
									tid: teams[i]._id.valueOf(),
									place: (i + 1),
									teamname: teams[i].teamname,
									school: teams[i].school,
									points: teams[i].points
								});
							}

							callback(teamArray);
						}
					});
				}
			});
		}
	});
};

/*
for generating graph... will be used later

var nTeamArray = [];
async.each(teamArray, function(team, callback2) {
	common.db.collection("accounts").find({
		_id: team._id
	}).toArray(function(err, accounts) {
		if (accounts.length == 1) {
			var account = accounts[0];
			common.db.collection("submissions").find({
				tid: team._id.valueOf(),
				correct: true
			}).sort({
				timestamp: 1
			}).toArray(function(err, data) {
				for(var i=data.length-1; i>=0; i--) {
					if (moment(data[i].timestamp).isAfter(common.endDate)) {
						data.spliace(i, 1);
					}
				}
				team.submissions = data;
				team.p = 0;
				nTeamArray.push(team);
				callback2();
			});
		}
	});
}, function(err) {
	var indices = [];
	for(var i=0; i<teams.length; i++) {
		for(var j=0; j<nTeamArray[i].submissions.length; j++) {
			var index = moment(nTeamArray[i].submissions[j].timestamp).diff(common.startDate);
		}
	}
});
*/