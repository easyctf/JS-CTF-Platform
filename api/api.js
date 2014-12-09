var account = require("./account");

module.exports = function(app) {
	app.get("/api", function(req, res) {
		res.send({ message: "The API is working.", });
	});

	//
	//   ACCOUNT
	//
	app.post("/api/register", function(req, res) {
		account.register(req, res);
	});
};