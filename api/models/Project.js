const mongoose = require("mongoose");
const projectSchema = require("../schemas/projectSchema.js");

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
