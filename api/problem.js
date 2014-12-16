var common = require("./common");
var moment = require("moment");
var ObjectID = require("mongodb").ObjectID;

exports.load_problems = function(tid, callback) {
	var problems = [];
	common.db.collection("accounts").findOne({
		_id: new ObjectID(tid)
	}, function(err, team) {
		if (err) {
			// fuck
			console.dir(err);
		} else {
			common.db.collection("submissions").find({
				tid: tid,
				correct: true
			}).toArray(function(err, doc) {
				if (err) {
					// fuck
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