var express    = require("express"),
	bodyParser = require("body-parser"),
	_          = require("underscore"),
	db         = require("./db.js");

var app = express();

var PORT = process.env.PORT || 3000;

var todos = [];
var nextTodoId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res) {
	res.send("Todo API root");
});

app.get("/todos", function(req, res) {
	var query = _.pick(req.query, ["q", "completed"]);
	var where = {};

	if (query.hasOwnProperty("completed")){
		if (query.completed === "true"){
			where.completed = true;
		} else if (query.completed === "false"){
			where.completed = false;
		} else {
			return res.status(400).send();
		}
	}

	if (query.hasOwnProperty("q")){
		if (query.q.length > 0){
			where.description = {
				$like: "%"+ query.q + "%"
			}
		} else {
			return res.status(400).send();
		}
	}

	db.todo.findAll({where: where}).then(function (foundTodos){
			res.json(foundTodos);
		}, function (err){
			res.status(500).send();
		});
});

app.get("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (foundTodo){
			if (foundTodo){
				res.json(foundTodo);
			} else {
				res.status(404).send();
			}
		}, function (err){
			res.status(500).send();
		});
});

app.post("/todos", function(req, res) {
	var body = _.pick(req.body, ["description", "completed"]);

	db.todo.create(body).then(function (todo){
			res.json(todo.toJSON());
		}, function (err){
			res.status(400).json(err);
		});
});

app.delete("/todos/:id", function(req, res) {
	var newTodos = _.reject(todos, function(todo) {
		return todo.id === parseInt(req.params.id, 10);
	});

	if (newTodos.length === todos.length) {
		res.status(404).send();
	} else {
		todos = newTodos;
		res.json(todos);
	}
});

app.put("todos/:id", function(req, res) {
	var body = _.pick(req.body, ["description", "completed"]);
	var matchedTodo = _.findWhere(todos, {
		id: parseInt(req.params.id, 10)
	});
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty("completed")) {
		if (_.isBoolean(body.completed)) {
			validAttributes.completed = body.completed;
		} else {
			return res.status(400).send();
		}
	}

	if (body.hasOwnProperty("description")) {
		if (_.isString(body.description) && body.description.trim().length > 0) {
			validAttributes.description = body.description.trim();
		} else {
			return res.status(400).send();
		}
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

db.sequelize.sync({force: true}).then(function (){
	app.listen(PORT, function() {
		console.log("Server started on port: " + PORT);
	});
});

