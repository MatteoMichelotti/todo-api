var cryptojs = require("crypto-js");

module.exports = function (db) {
	return {

		requireAuthentication: function (req, res, next){
			var token = req.get("Auth") || "";

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString();
				}
			}).then(function (tokenInstance){
				if (!tokenInstance){
					throw new Error();
				}
				req.token = tokenInstance;
				return db.user.findByToken(token);
			}).then(function (foundUser){
				req.user = foundUser;
				next();
			}).catch(function (err){
				res.status(401).send();
			});
		}
	};
}