const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
  project_id: String,
  username: String,
  title: String,
  description: String,
  priority: String,
  status: String,
  date: Number,
});

module.exports = Task;
