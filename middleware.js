module.exports = function (db) {
	return {

		requireAuthentication: function (req, res, next){
			var token = req.get("Auth");

			db.user.findByToken(token).then(function (foundUser){
				req.user = foundUser;
				next();
			}, function () {
				res.status(401).send();
			});
		}

	};
}