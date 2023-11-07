const Project = require("../models/Project.js");
const Task = require("../models/Task.js");
const { error500 } = require("../helpers/errorHandling.js");

const createProject = async (req, res) => {
  const { title, description } = req.body;
  const { username } = req.user;

  if (!title || !description) {
    res.status(422).json({ error: "Faltam um ou mais dados." });
    return;
  }

  const project = {
    title,
    description,
    username,
    date: new Date(),
  };

  try {
    await Project.create(project);
    res.status(201).json({ message: "Projeto criado com sucesso." });
  } catch (error) {
    error500(error, res);
  }
};

const getProjects = async (req, res) => {
  const { username } = req.user;
  try {
    const projects = await Project.find({ username: username });
    res.status(200).json(projects);
  } catch (error) {
    error500(error, res);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;
  try {
    const project = await Project.findOne({ _id: id });

    if (username !== project.username) {
      res.status(403).json({ error: "Operação não permitida." });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    error500(error, res);
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  const { title, description } = req.body;

  const project = await Project.findOne({ _id: id });

  if (!project) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return;
  }

  if (username !== project.username) {
    res.status(403).json({ error: "Operação não permitida." });
    return;
  }

  const updateProject = {
    title,
    description,
  };

  try {
    await Project.updateOne({ _id: id }, updateProject);
    res.status(200).json({ message: "Projeto editado com sucesso." });
  } catch (error) {
    error500(error, res);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  const project = await Project.findOne({ _id: id });

  if (!project) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return;
  }

  if (username !== project.username) {
    res.status(403).json({ error: "Operação não permitida." });
    return;
  }

  try {
    await Task.deleteMany({ project_id: id });
  } catch (error) {
    error500(error, res);
    return;
  }

  try {
    await Project.deleteOne({ _id: id });
    // res.status(204);
    res.status(200).json({ message: "Projeto apagado com sucesso." });
    return;
  } catch (error) {
    error500(error, res);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  editProject,
  deleteProject,
};
