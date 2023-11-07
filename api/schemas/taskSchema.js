const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  project_id: { type: String, required: true },
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: Number, required: true },
});

module.exports = taskSchema;
