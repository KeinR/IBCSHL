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
    animal: req.query.animal || "",
    birthday: req.query.birthday || new Date(),
    image: req.query.image || ""
  }});
});

app.post('/save/:id?', async (req,res) => {
  if (req.params.id == undefined) {
    student = new Student();
  } else {
    student = await Student.findById(req.params.id).exec();
  }
  student.name = req.body.name;
  student.animal = req.body.animal;
  student.birthday = req.body.birthday;
  student.image = req.body.image;
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
