(function() {
	window.dispatch = function() {
		$("[id^=forgot-]").attr("disabled", "disabled");
		$.ajax({
			url: "/api/forgot",
			dataType: "json",
			data: {
				email: $("#forgot-email").val()
			},
			type: "POST",
			success: function(data) {
				var alert_class = "";
				if (data.success == 1) {
					alert_class = "success";
				} else {
					alert_class = "danger";
					$("[id^=forgot-]").removeAttr("disabled");
				}
				$("#forgot_msg").hide().html("<div class=\"alert alert-" + alert_class + "\"> " + data['message'] + " </div>").slideDown("normal");
				setTimeout(function() {
					$("#forgot_msg").slideUp("normal", function() {
						return $("#forgot_msg").html("").show();
					});
				}, 2000);
			},
		});
	};
})();