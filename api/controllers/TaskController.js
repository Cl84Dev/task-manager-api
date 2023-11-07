const Task = require("../models/Task.js");
const { error500 } = require("../helpers/errorHandling.js");

const getTasks = async (req, res) => {
  const { project_id } = req.params;

  try {
    const tasks = await Task.find({ project_id: project_id });
    res.status(200).json(tasks);
  } catch (error) {
    error500(error, res);
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  try {
    const task = await Task.findOne({ _id: id });

    if (username !== task.username) {
      res.status(403).json({ error: "Operação não permitida." });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    error500(error, res);
  }
};

const createTask = async (req, res) => {
  const { project_id, title, description, priority, status } = req.body;
  const { username } = req.user;

  if (!project_id || !title || !description || !priority || !status) {
    res.status(422).json({ error: "Faltam um ou mais dados." });
    return;
  }

  const task = {
    project_id,
    title,
    description,
    priority,
    status,
    username,
    date: new Date(),
  };

  try {
    await Task.create(task);
    res.status(201).json({ message: "Tarefa criada com sucesso." });
  } catch (error) {
    error500(error, res);
  }
};

const editTask = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  const { title, description, priority, status } = req.body;

  const task = await Task.findOne({ _id: id });

  if (!task) {
    res.status(404).json({ error: "Tarefa não encontrada." });
    return;
  }

  if (username !== task.username) {
    res.status(403).json({ error: "Operação não permitida." });
    return;
  }

  const updateTask = {
    title,
    description,
    priority,
    status,
  };

  try {
    await Task.updateOne({ _id: id }, updateTask);
    res.status(200).json({ message: "Tarefa editada com sucesso." });
  } catch (error) {
    error500(error, res);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  const task = await Task.findOne({ _id: id });

  if (!task) {
    res.status(404).json({ error: "Tarefa não encontrada." });
    return;
  }

  if (username !== task.username) {
    res.status(403).json({ error: "Operação não permitida." });
    return;
  }

  try {
    await Task.deleteOne({ _id: id });
    // res.status(204);
    res.status(200).json({ message: "Tarefa apagada com sucesso." });
    return;
  } catch (error) {
    error500(error, res);
  }
};

module.exports = { getTasks, getTask, editTask, createTask, deleteTask };
