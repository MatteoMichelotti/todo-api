// var Person = {
// 	name: "Matteo",
// 	age: 20
// };


// function doesntUpdate (obj) {
// 	obj = {
// 		name: "Matteo",
// 		age: 30
// 	};
// }

// function doesUpdate (obj) {
// 	obj.age = 30;
// }

// doesntUpdate(Person);
// console.log(Person);

// doesUpdate(Person);
// console.log(Person);

var grades = [70, 85];

function wontAddGrade (arr) {
	arr = [12, 33, 85];
	debugger;
}

function willAddGrade (arr) {
	arr.push(55);
	debugger;
}

wontAddGrade(grades);
console.log(grades);

willAddGrade(grades);
console.log(grades);