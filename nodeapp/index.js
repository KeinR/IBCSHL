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

const OWNER = "ORIONMUSSELMAN";
let Student = require('./models/student');

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
    Student.find({owner: OWNER} , (err, students) => {
      if(err) {
        console.err(err);
      }
      res.render('list.ejs', {students: students});
    });
});

app.get('/', (req,res) => {
  res.redirect('/list');
});

app.get('/add', (req,res) => {
  res.render('add.ejs');
});

app.get('/update/:id', (req,res) => {
  res.render('update.ejs', {student: {
    _id: req.params.id,
    name: req.query.name || "",
    spiritAnimal: req.query.animal || ""
  }});
});

app.post('/save/:id', async (req,res) => {
  let student = await Student.findById(req.params.id).exec();
  if (student == null) {
    student = new Student({name: "Jhon Doe", animal:"Deer"});
  }
  student.name = req.body.name;
  student.animal = req.body.animal;
  console.log(student);
  await student.save();
  res.redirect('/list');
});

app.get('/delete/:id', async (req,res) => {
  await Student.findByIdAndDelete(req.params.id).exec();
  res.redirect('/list');
});

app.get('/detail/:id', async (req,res) => {
  res.render('detail.ejs', {student: await Student.findById(req.params.id).exec()});
});

mongoose.connect("mongodb+srv://malbinson:berkeley01@cluster0.cvp0r.mongodb.net/hl_2020?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("db connected");
});

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});
