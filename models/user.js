var bcryptjs = require("bcryptjs"),
	_        = require("underscore");

module.exports = function (sequelize, DataTypes){
	var user = sequelize.define("user", {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: { type: DataTypes.STRING },
		hash: {	type: DataTypes.STRING },
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7,100]
			},
			set: function (value){
				var salt = bcryptjs.genSaltSync(10);
				var hash = bcryptjs.hashSync(value, salt);

				this.setDataValue("password",value);
				this.setDataValue("salt", salt);
				this.setDataValue("hash", hash);
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options){
				if (typeof user.email === "string"){
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function (){
				var json = this.toJSON();
				return _.pick(json, ["id", "email", "createdAt", "updatedAt"]);
			}
		},
		classMethods: {
			authenticate: function (body){
				return new Promise (function (resolve, reject){
					if (typeof body.email === "string" && typeof body.password === "string"){
						user.findOne({
							where: { email: body.email.toLowerCase() }
						}).then(function (foundUser){
							if (foundUser && bcryptjs.compareSync(body.password, foundUser.get("hash"))){
								return resolve(foundUser);
							}

							return reject({status: 401});

						}, function (err){
							return reject({status: 500});
						})
					} else {
						return reject({status: 400});
					}
				});
			}
		}
	});

return user;
}