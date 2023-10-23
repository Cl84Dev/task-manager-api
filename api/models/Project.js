const mongoose = require("mongoose");

const Project = mongoose.model("Project", {
  username: String,
  title: String,
  description: String,
  date: Number,
});

module.exports = Project;
