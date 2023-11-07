const express = require("express");
const ProjectController = require("../controllers/ProjectController.js");

const projectRouter = express.Router();

projectRouter.post("/project", ProjectController.createProject);

projectRouter.get("/project", ProjectController.getProjects);

projectRouter.get("/project/:id", ProjectController.getProject);

projectRouter.patch("/project/:id", ProjectController.editProject);

projectRouter.delete("/project/:id", ProjectController.deleteProject);

module.exports = projectRouter;
