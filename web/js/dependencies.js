var startDate = Date.parse('14 Feb 2015 09:00:00 GMT-0500');
var endDate = Date.parse('21 Feb 2015 21:00:00 GMT-0500');

var tabsLI = [
	[ "problems", "Problems" ],
	/* [ "exec", "Python" ], */ /* UNCOMMENT THIS IF YOU WANT THE PYTHON EDITOR */
	[ "irc", "Chat" ],
	[ "shell", "Shell" ],
	[ "account", "Account" ],
	[ "logout", "Logout" ],
];

var tabsLIBefore = [
	[ "account", "Account" ],
	[ "logout", "Logout" ],
];

var tabsNLI = [
	[ "register", "Register" ],
	[ "login", "Login" ],
];

var tabsBoth = [
	[ "about", "About" ],
	[ "updates", "Updates"],
	[ "scoreboard", "Scoreboard" ],
];

function _(str) {
	if (str.length > 13) {
		return str.substring(0, 10) + "...";
	}
	return str;
}

function build_navbar (set) {
	var ohtml = "";
	switch (set) {
		case 0:
			for(var i=0; i<tabsLI.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsLI[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsLI[i][0]+"'><a href='/"+tabsLI[i][0]+"'>"+tabsLI[i][1]+"</a></li>";
			}
			$("#nav-right")[0].innerHTML = ohtml;
			break;
		case 1:
			for(var i=0; i<tabsNLI.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsNLI[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsNLI[i][0]+"'><a href='/"+tabsNLI[i][0]+"'>"+tabsNLI[i][1]+"</a></li>";
			}
			$("#nav-right")[0].innerHTML = ohtml;
			break;
		case 2:
			for(var i=0; i<tabsBoth.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsBoth[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsBoth[i][0]+"'><a href='/"+tabsBoth[i][0]+"'>"+tabsBoth[i][1]+"</a></li>";
			}
			$("#nav-left")[0].innerHTML = ohtml;
			break;
		case 3:
			for(var i=0; i<tabsLIBefore.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsLIBefore[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsLIBefore[i][0]+"'><a href='/"+tabsLIBefore[i][0]+"'>"+tabsLIBefore[i][1]+"</a></li>";
			}
			$("#nav-right")[0].innerHTML = ohtml;
			break;
		default:
			// fuck you
			break;
	}
}
	
function display_navbar () {
	var now = new Date();
	var during = startDate < now && endDate > now;

	$.ajax({
		url: "/api/auth/loggedin",
		method: "GET",
		dataType: "json"
	}).done(function(data) {
		console.dir(data);
		build_navbar(2);
		if (data.success === 1) {
			$.ajax({
				url: "/api/auth/authorized",
				method: "GET",
				dataType: "json"
			}).done(function(data2) {
				if (data2.success === 1) {
					build_navbar(0);
				} else {
					build_navbar(3);
				}
			});
		} else {
			build_navbar(1);
		}
	});
}

function load_footer() {
	$.ajax({
		type: "GET",
		cache: false,
		url: "/dependencies/footer.html",
	}).done(function(data) {
		$("#footer").html(data);
	});
}