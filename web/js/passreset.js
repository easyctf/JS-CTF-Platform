(function() {
	window.dispatch = function() {
		$("[id^=verify-]").attr("disabled", "disabled");
		$.ajax({
			url: "/api/forgot/reset",
			dataType: "json",
			data: {
				code: $("#-verify-code").val(),
				p1: $("#verify-password1").val(),
				p2: $("#verify-password2").val(),
			},
			type: "POST",
			success: function(data) {
				var alert_class = "";
				if (data.success == 1) {
					alert_class = "success";
				} else {
					alert_class = "danger";
					$("[id^=verify-]").removeAttr("disabled");
				}
				$("#verify_msg").hide().html("<div class=\"alert alert-" + alert_class + "\"> " + data['message'] + " </div>").slideDown("normal");
				setTimeout(function() {
					$("#verify_msg").slideUp("normal", function() {
						return $("#verify_msg").html("").show();
					});
				}, 2000);
			},
		});
	};
})();