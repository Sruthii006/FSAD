const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: String
});

module.exports = mongoose.model("Assignment", assignmentSchema);