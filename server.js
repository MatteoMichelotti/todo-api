var express = require("express");
var app = express();

var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: "Water the plants",
	completed: false
}, {
	id: 2,
	description: "Buy grocery",
	completed: false
}, {
	id: 3,
	description: "Feed the cat",
	completed: true
}];


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

app.listen(PORT, function() {
	console.log("Server started on port: " + PORT);
});