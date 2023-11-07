const mongoose = require("mongoose");
const taskSchema = require("../schemas/taskSchema.js");

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
