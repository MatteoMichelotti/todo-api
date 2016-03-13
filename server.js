var express = require("express"),
	bodyParser = require("body-parser"),
	_ = require("underscore");

var app = express();

var PORT = process.env.PORT || 3000;

var todos = [];
var nextTodoId = 1;

app.use(bodyParser.json());

app.get("/", function (req, res){
	res.send("Todo API root");
});

app.get("/todos", function (req, res) {
	var queryParams = _.pick(req.query, ["description", "completed"]);
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty("completed")){
		if (queryParams.completed === "true"){
			filteredTodos = _.where(filteredTodos, {completed: true});
		} else if (queryParams.completed === "false"){
			filteredTodos = _.where(filteredTodos, {completed: false});
		} else {
			return res.status(400).send();
		}
	}

	res.json(filteredTodos);
});

app.get("/todos/:id", function (req, res) {
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id, 10)});
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.post("/todos", function (req, res){
	var body = _.pick(req.body, ["description", "completed"]);

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	body.description = body.description.trim();
	body.id = nextTodoId++;
	todos.push(body);
	res.json(body);
});

app.delete("/todos/:id", function (req, res) {
	var newTodos = _.reject(todos, function (todo) {
		return todo.id === parseInt(req.params.id, 10);
	});

	if (newTodos.length === todos.length){
		res.status(404).send();
	} else {
		todos = newTodos;
		res.json(todos);
	}
});

app.put("todos/:id", function (req, res){
	var body = _.pick(req.body, ["description", "completed"]);
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id, 10)});
	var validAttributes = {};

	if (!matchedTodo){
		return res.status(404).send();
	}

	if (body.hasOwnProperty("completed")){
		if (_.isBoolean(body.completed)){
			validAttributes.completed = body.completed;
		} else {
			return res.status(400).send();
		}
	}

	if (body.hasOwnProperty("description")){
		if (_.isString(body.description) && body.description.trim().length > 0){
			validAttributes.description = body.description.trim();
		} else {
			return res.status(400).send();
		}
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});



app.listen(PORT, function() {
	console.log("Server started on port: " + PORT);
});