var bcryptjs = require("bcryptjs"),
	_        = require("underscore");

module.exports = function (sequelize, DataTypes){
	return sequelize.define("user", {
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
				var hashedPassword = bcryptjs.hashSync(value, salt);

				this.setDataValue("password",value);
				this.setDataValue("salt", salt);
				this.setDataValue("hash", hashedPassword);
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
		}
	});
}