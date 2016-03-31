var    express = require("express"),
	  bcryptjs = require("bcryptjs"),
	         _ = require("underscore"),
	bodyParser = require("body-parser");

var         db  = require("./db.js"),
	middleware  = require("./middleware.js")(db);

var app = express();

var PORT = process.env.PORT || 3000;

var todos = [];
var nextTodoId = 1;

app.use(bodyParser.json());

//==== ROOT ROUTE ====
app.get("/", function (req, res) {
	res.send("Todo API root");
});

//==== TODO ROUTES ====
//---- INDEX ----
app.get("/todos", middleware.requireAuthentication, function (req, res) {
	var query = _.pick(req.query, ["q", "completed"]);
	var where = {};

	if (query.hasOwnProperty("completed")) {
		if (query.completed === "true") {
			where.completed = true;
		} else if (query.completed === "false") {
			where.completed = false;
		} else {
			return res.status(400).send();
		}
	}

	if (query.hasOwnProperty("q")) {
		if (query.q.length > 0) {
			where.description = {
				$like: "%" + query.q + "%"
			}
		} else {
			return res.status(400).send();
		}
	}

	db.todo.findAll({
		where: where
	}).then(function (foundTodos) {
		res.json(foundTodos);
	}, function (err) {
		res.status(500).send();
	});
});

//---- SHOW ----
app.get("/todos/:id", middleware.requireAuthentication, function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (foundTodo) {
		if (foundTodo) {
			res.json(foundTodo);
		} else {
			res.status(404).send();
		}
	}, function (err) {
		res.status(500).send();
	});
});

//---- CREATE ----
app.post("/todos", middleware.requireAuthentication, function (req, res) {
	var body = _.pick(req.body, ["description", "completed"]);

	db.todo.create(body).then(function (todo) {
		req.user.addTodo(todo).then(function (){
			return todo.reload();
		}).then(function (todo){
			res.json(todo.toJSON());
		});
	}, function (err) {
		res.status(400).json(err);
	});
});

//---- DESTROY ----
app.delete("/todos/:id", middleware.requireAuthentication, function (req, res) {

	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function (num) {
		if (num > 0) {
			res.send("Todo Deleted (" + num + ")");
		} else {
			res.status(404).send("Todo not found");
		}
	}, function (err) {
		res.status(500).send();
	});
});

//---- UPDATE ----
app.put("/todos/:id", middleware.requireAuthentication, function (req, res) {
	var body = _.pick(req.body, ["description", "completed"]);
	var todoId = parseInt(req.params.id, 10);
	var attributes = {};

	if (body.hasOwnProperty("completed")) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty("description")) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function (foundTodo) {
		if (foundTodo) {
			foundTodo.update(attributes).then(function (updatedTodo) {
				res.json(updatedTodo.toJSON());
			}, function (err) {
				res.status(400).json(err);
			});
		} else {
			res.status(404).send();
		}
	}, function (err) {
		res.status(500).send();
	});
});

//==== USER ROUTES ====
//---- CREATE ----
app.post("/users", function (req, res){
	var body = _.pick(req.body, ["email", "password"]);

	db.user.create(body).then(function (user){
		res.json(user.toPublicJSON());
	}, function (err){
		res.status(400).json(err);
	})
});

//---- LOGIN ----
app.post("/users/login", function (req, res){
	var body = _.pick(req.body, ["email", "password"]);

	db.user.authenticate(body).then(function (user){
		var token = user.generateToken("authentication");
		if (token){
			res.header("Auth", token).json(user.toPublicJSON());
		} else {
			res.status(401).send();
		}
		
	}, function (err){
		res.status(err.status).send();
	});
});


//==== LISTENER ====
db.sequelize.sync({
	force: true
}).then(function () {
	app.listen(PORT, function () {
		console.log("Server started on port: " + PORT);
	});
});