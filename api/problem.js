var common = require("./common");
var moment = require("moment");
var ObjectID = require("mongodb").ObjectID;

exports.load_problems = function(tid, callback) {
	var problems = [];
	common.db.collection("accounts").findOne({
		_id: new ObjectID(tid)
	}, function(err, team) {
		if (err) {
			console.dir(err);
		} else {
			common.db.collection("submissions").find({
				tid: tid,
				correct: true
			}).toArray(function(err, doc) {
				if (err) {
					console.dir(err);
				} else {
					var correctPIDs = [];
					for(var i=0; i<doc.length; i++) {
						correctPIDs.push(doc[i].pid);
					}
					common.db.collection("problems").find({
						basescore: {
							$gt: 0
						}
					}).sort({
						basescore: 1,
						displayname: 1
					}).toArray(function(err, doc) {
						for(var i=0; i<doc.length; i++) {
							var p = doc[i];
							if (true) {
								problems.push({
									pid: p.pid,
									displayname: p.displayname,
									hint: p.hint,
									basescore: p.basescore,
									correct: correctPIDs.indexOf(p.pid) != -1,
									desc: p.desc
								});
							}
						}
						problems.sort(function(a, b) {
							if (a.basescore > b.basescore) {
								return 1;
							} else if (a.basescore < b.basescore) {
								return -1;
							} else {
								return 0;
							}
						});
						callback(problems);
					});
				}
			});
		}
	});
};

exports.submit_problem = function(req, callback) {
	var pid = req.param("pid");
	var tid = req.session.tid;
	var key = req.param("key");
	var correct = false;

	if (pid == undefined || pid.length == 0) {
		callback({
			status: 0,
			points: 0,
			message: "Problem ID cannot be empty."
		});
		return;
	}
	if (key == undefined || key.length == 0) {
		callback({
			status: 0,
			points: 0,
			message: "Answer cannot be empty."
		});
		return;
	}
	exports.load_problems(tid, function(problems) {
		var has = false;
		for(var i=0; i<problems.length; i++) {
			if (problems[i].pid.indexOf(pid) != -1) {
				has = true;
				break;
			}
		}

		if (!has) {
			callback({
				status: 0,
				points: 0,
				message: "You cannot submit problems that you haven't unlocked yet! (a.k.a. stop trying to XSS)"
			});
			return;
		}
		
		common.db.collection("problems").findOne({
			pid: pid
		}, function(err, prob) {
			if (prob == undefined) {
				callback({
					status: 0,
					points: 0,
					message: "No problem ID in database, stahp XSS pls"
				});
				return;
			}

			if (!prob.autogen) {
				require("./graders/" + prob.grader).grade(tid, key, function(obj) {
					submit_problem_result(pid, key, tid, req.connection.remoteAddress, prob.basescore, obj, function(result) {
						callback({
							status: result.status,
							points: obj.correct ? prob.basescore : 0,
							message: result.message
						});
						return;
					});
				});
			} else {

			}
		});
	});
};

var submit_problem_result = function(pid, key, tid, ip, pts, result, callback) {
	if (result.correct) {
		common.db.collection("submissions").find({
			tid: tid,
			pid: pid,
			correct: true
		}).toArray(function(err, doc) {
			if (doc.length == 0) {
				common.db.collection("submissions").insert({
					tid: tid,
					pid: pid,
					key: key,
					ip: ip,
					correct: true,
					timestamp: moment().format(),
					pts: pts
				}, { w: 1 }, function(err, doc) {
					callback({
						status: 1,
						message: result.message
					});
					return;
				});
			} else {
				callback({
					status: 0,
					message: "You have already solved this problem!"
				});
				return;
			}
		});
	} else {
		common.db.collection("submissions").find({
			tid: tid,
			pid: pid,
			correct: false,
			key: key
		}).toArray(function(err, doc) {
			if (doc.length == 0) {
				common.db.collection("submissions").insert({
					tid: tid,
					pid: pid,
					key: key,
					ip: ip,
					correct: false,
					timestamp: moment().format(),
					pts: 0,
				}, { w: 1 }, function(err, doc) {
					callback({
						status: 0,
						message: result.message
					});
					return;
				});
			} else {
				callback({
					status: 0,
					message: "You have already tried that answer!"
				});
				return;
			}
		});
	}
};