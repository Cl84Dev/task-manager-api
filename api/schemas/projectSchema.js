const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Number, required: true },
});

module.exports = projectSchema;
