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

//our little fake db we will use for now
let students = [
  {id:1, name:"Humble Galka", spiritAnimal:"shark"},
  {id:2, name:"Lassi Sevanto", spiritAnimal:"owl"},
  {id:3, name:"Anna Tripier", spiritAnimal:"bear"},
  {id:4, name:"Orion Musselman", spiritAnimal:"tiger"}
];

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
    res.render('index.ejs', {greeting: 'Hello world!'});
});

app.get('/add', (req,res) => {
  res.render('add.ejs');
});

app.post('/save', (req,res) => {
  console.log(req.body.name);
  console.log(req.body.animal);
  students.push({
    id: students.length + 1,
    name: req.body.name,
    spiritAnimal: req.body.animal
  });
  res.render('list.ejs', {students: students});
});

app.get('/detail/:id', (req,res) => {
  res.render('detail.ejs', {student: students[req.params.id - 1]});
});

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});

