var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
	"dialect": "sqlite",
	"storage": __dirname + "/basic-sqlite.sqlite"
});

var Todo = sequelize.define("todo", {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({force: true}).then(function (){
	console.log("Everything is synced");

	Todo.create({
		description: "Walk the dog",
		completed: false
	}).then (function (todo){
		return Todo.create({
			description: "Clean house"
		});
	}).then (function (todo){
		
		return Todo.findAll({
			where: {
				description: {
					$like: "%clean%"
				}
			}
		});
	}).then (function (foundTodos){
		if (foundTodos){
			foundTodos.forEach(function (todo){
				console.log(todo.toJSON());
			});				
		} else {
			console.log("No Todo found!");
		}
	}).catch(function(err){
		console.log(err);
	});
});