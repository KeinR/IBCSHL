//3rd party software that we will use
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//settings for our app
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static("public"))
app.set('view engine', ejs)

let Student = require('./models/student')

students = {}

function setStudent(id, name, animal) {
  students[id] = {
    id: id,
    name: name,
    spiritAnimal: animal
  }
}

function newStudentID() {
  let res;
  do {
    res = Math.random() * Number.MAX_SAFE_INTEGER
  } while (students[res] != undefined);
  return res;
}

setStudent(1, "Humble Galka", "shark");
setStudent(2, "Lassi Sevanto", "owl");
setStudent(3, "Anna Tripier", "bear");
setStudent(4, "Orion Musselman", "tiger");

// 1
//write a route that handles a "get" at the 
//path "read" of the application and returns a 
//string "hello world" to the client
app.get('/read', (req,res) => {
    res.send('Hello world!');
});

// 2
//write a route that handles a "get" at the 
//path "list" and returns the 
//"students" array to the client
//append the list to the output div
app.get('/list', (req,res) => {
    res.render('list.ejs', {students: students});
});

app.get('/', (req,res) => {
  res.redirect('/list');
});

app.get('/add', (req,res) => {
  res.render('add.ejs');
});

app.get('/update/:id', (req,res) => {
  res.render('update.ejs', {student: {
    id: req.params.id,
    name: req.query.name || "",
    spiritAnimal: req.query.animal || ""
  }});
  // // res.render('add.ejs');
  // res.send('foo');
});

app.post('/save', (req,res) => {
  setStudent(req.body.id, req.body.name, req.body.animal);
  res.render('list.ejs', {students: students});
});

app.get('/delete/:id', (req,res) => {
  if (students[req.params.id] != undefined) {
    delete students[req.params.id];
  }
  res.render('list.ejs', {students: students});
});

app.get('/detail/:id', (req,res) => {
  res.render('detail.ejs', {student: students[req.params.id]});
});

mongoose.connect("mongodb+srv://malbinson:berkeley01@cluster0.cvp0r.mongodb.net/hl_2020?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("db connected");
  fef = new Student({name: "foo", username: "fewfw"});
  fef.save();
});

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});
