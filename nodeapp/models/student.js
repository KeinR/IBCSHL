let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let studentSchema = new Schema({
  id: Number,
  name: String,
  animal: String,
  owner: {type: String, default: "ORIONMUSSELMAN"}
});

//attach schema to model
let Student = mongoose.model('Student', studentSchema);

// make this available to our users in our Node applications
module.exports = Student;
