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
	res.json(todos);
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


app.listen(PORT, function() {
	console.log("Server started on port: " + PORT);
});