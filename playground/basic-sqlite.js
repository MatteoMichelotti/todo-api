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

var User = sequelize.define("user", {
	email: Sequelize.STRING
});

//Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	force: true
}).then(function (){
	console.log("Everything is synced");

	//create association between user 1 and todo 1
	User.create({
		email: "user@example.com"
	}).then(function (user){
		Todo.create({
			description: "Crean room"
		}).then(function (todo){
			user.addTodo(todo);
		}, function (err){

		});
	}, function (err){

	});

	//find all todos user 1 added
	User.findById(1).then(function (user){
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function (todos){
			todos.forEach(function (todo){
				console.log(todo.toJSON());
			});
		});
	});
});