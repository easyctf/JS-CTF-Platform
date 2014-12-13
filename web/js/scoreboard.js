(function() {
	window.load_scoreboard = function() {
		$.ajax({
			type: "GET",
			url: "/api/scoreboard",
			dataType: "html",
			cache: false,
			async: true
		}).done(function(board) {
			console.log(board);
			$("#public_scoreboard_container").html(board);
		});
	};

	window.load_graph = function() {
		if (new Date() > startDate) {
			$.ajax({
				type: "GET",
				cache: false,
				url: "/api/scoreboard/graph",
				dataType: "json"
			}).done(function(data) {
				if (data.success == 1) {
					window._points = data.points;
					window._options = data.options;
					google.load('visualization', '1', {packages:['corechart'], callback: function() {
						console.log("loaded");
						var data = google.visualization.arrayToDataTable(window._points);
						var options = window._options;
						var chart = new google.visualization.LineChart(document.getElementById("graph_container"));
						chart.draw(data, options);
						console.log("drew graph");
					}});
				}
			});
		} else {
			// console.log("let's not load the graph for now")
		}
	};
}).call(this);