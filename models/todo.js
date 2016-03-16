module.exports = function (sequelize, DataTypes){
	return sequelize.define("todo", {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isString: function (value){
					if (typeof value !== "string"){
						throw new Error("description MUST be a string")
					}
				},
				len: [1, 250]
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			validate: {
				isBoolean: function (value){
					if (typeof value !== "boolean"){
						throw new Error("Completed MUST be a boolean!");
					}
				}
			}
		}
	});
};