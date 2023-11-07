const express = require("express");
const TaskController = require("../controllers/TaskController.js");

const taskRouter = express.Router();

taskRouter.get("/tasks/:project_id", TaskController.getTasks);

taskRouter.get("/task/:id", TaskController.getTask);

taskRouter.post("/task", TaskController.createTask);

taskRouter.patch("/task/:id", TaskController.editTask);

taskRouter.delete("/task/:id", TaskController.deleteTask);

module.exports = taskRouter;
