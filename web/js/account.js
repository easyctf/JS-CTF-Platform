(function() {
	window.load_account_info = function() {
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/api/account/info"
		}).done(function(data) {
			if (data.success == 1) {
				$("#account-name").val(data.name);
				$("#account-email").val(data.email);
				$("#account-school").val(data.school);
			} else {
				// why
			}
		});
	}

	window.updateInfo = function() {
		$("[id^=account-]").attr("disabled", "disabled");
		$.ajax({
			url: "/api/account/update",
			type: "POST",
			dataType: "json",
			data: {
				teamname: $("#account-name").val(),
				school: $("#account-school").val(),
				password: $("#account-password").val(),
				confirm: $("#account-confirm").val(),
			}
		}).done(function(data) {
			console.dir(data);
			if (data.success !== 1) {
				$("#update_msg").hide().html("<div class='alert alert-danger'>" + data.message + "</div>").slideDown("normal");
				setTimeout(function() {
					return $("#update_msg").slideUp("normal", function() {
						return $("#update_msg").html("").show();
					});
				}, 2000);
				$("[id^=account-]").removeAttr("disabled");
			} else {
				$("#update_msg").hide().html("<div class='alert alert-success'>" + data.message + "</div>").slideDown("normal");
				return setTimeout(function() {
					return $("#update_msg").slideUp("normal", function() {
						$("#update_msg").html("").show();
						window.location.reload(true);
					});
				}, 2000);
			}
		});
	};
}).call(this);