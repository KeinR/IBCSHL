let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let studentSchema = new Schema({
  name: {type: String, default: "Jhon Doe"},
  animal: {type: String, default: "Deer"}, // Jhon Deer
  birthday: {type: Date, default: new Date()},
  image: {type: String, default: "https://en.touhouwiki.net/images/f/fe/Th06Rumia.png"},
  owner: {type: String, default: "ORIONMUSSELMAN"}
});

//attach schema to model
let Student = mongoose.model('Student', studentSchema);

// make this available to our users in our Node applications
module.exports = Student;
