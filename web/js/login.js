(function() {
	window.handle_login = function() {
		return $.ajax({
			type: "POST",
			cache: false,
			url: "/api/auth/login",
			dataType: "json",
			data: {
				teamname: $("#log-team").val(),
				password: $("#log-pass").val()
			}
		}).done(function(data) {
			var alert_class;
			if (data['success'] === 0 || data['success'] === 2) {
				if (typeof Storage !== undefined) {
					sessionStorage.signInStatus = "notLoggedIn";
				}
				if (data['success'] == 0) {
					alert_class = "danger";
				} else {
					alert_class = "info";
				}
				$("#login_msg").hide().html("<div class=\"alert alert-" + alert_class + "\"> " + data['message'] + " </div>").slideDown("normal");
				return setTimeout(function() {
					return $("#login_msg").slideUp("normal", function() {
						return $("#login_msg").html("").show();
					});
				}, 2000);
			} else if (data['success'] === 1) {
				if (typeof Storage !== "undefined") {
					sessionStorage.signInStatus = "loggedIn";
				}
				return document.location.href = (new Date("November 29, 2014 19:00:00") < new Date()) ? "problems" : "account";
			}
		}).fail(function(data) {
			
		});
	};
}).call(this);