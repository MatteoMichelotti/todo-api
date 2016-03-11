var express = require("express"),
	bodyParser = require("body-parser");

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

	todos.forEach(function (todo) {
		if (todo.id.toString() === req.params.id){
			res.json(todo);
		}
	});
	res.status(404).send();
});

app.post("/todos", function (req, res){
	var body = req.body;
	body.id = nextTodoId++;
	todos.push(body);
	res.json(body);
});


app.listen(PORT, function() {
	console.log("Server started on port: " + PORT);
});