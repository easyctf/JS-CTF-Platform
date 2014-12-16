(function() {
	window.load_problems = function() {
		$.ajax({
			type: "GET",
			cache: false,
			url: "/api/problems",
			dataType: "json"
		}).done(function(data) {
			console.dir(data);
			if (data.status === 0) {
				var html = "<div class='alert alert-danger'>" + data.message + "</div>";
			} else {
				var html = "<div class='panel-group'>"; // id='accordion' role='tablist' aria-multiselectable='true'>";
				for(var i=0; i<data.length; i++) {
					var d = data[i];
					var id = d.pid;
					html += "<div class='panel panel-default'>";
						html += "<div class='panel-heading' role='tab' id='heading"+i+"'>";
							html += "<h4 class='panel-title'>";
								html += "<a class='NO_HOVER_UNDERLINE_DAMMIT' style='display:block;' data-toggle='collapse' data-parent='#accordion' href='#collapse"+i+"' aria-expanded='true' aria-controls='collapse"+i+"'>";
									html += d.displayname + ": " + d.basescore;
									html += "<span style='float:right;'>";
										html += d.correct ? "<span class='solved'>Solved</span>" : "<span class='unsolved'>Unsolved</span>";
									html += "</span>";
								html += "</a>";
							html += "</h4>";
						html += "</div>";
						html += "<div id='collapse"+i+"' class='panel-collapse collapse" + (d.correct ? "" : " in") + "' role='tabpanel' aria-labelledby='heading"+i+"'>";
							html += "<div class='panel-body problem_statement'>";
								html += "<div id='msg_"+d.pid+"'>";
								html += "</div>";
								html += "<p>";
									html += d.desc;
								html += "</p>";
								html += "<form onsubmit=\"handle_submit('" + id + "'); return false;\" class='form-inline' id='form_"+id+"'>";
									html += "<input type='text' class='form-control' autocomplete='off' id=\""+id+"\" /> ";
									html += "<input type='submit' class='btn btn-primary' /> ";
									html += "<a class='show_hint_btn btn btn-primary' href='javascript:show_hint(\""+id+"\");'>Show Hint</a>";
								html += "</form>";
								html += "<br />";
								html += "<div style='display:none;' class='well' id='hint_"+id+"'>";
									html += d.hint;
								html += "</div>";
							html += "</div>";
						html += "</div>";
					html += "</div>";
				}
				html += "</div>";
			}
			$("#problems_holder").html(html);
			$(".solved").parent().parent().next().hide();
		});
	};

	window.show_hint = function(id) {
		$("#hint_"+id).slideToggle();
	};
}).call(this);