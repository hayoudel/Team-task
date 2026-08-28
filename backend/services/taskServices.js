import Task from "../models/taskModels.js";
import User from "../models/userModels.js";


export const createTask = async (taskData, userId) => {

  const task = await Task.create({
    ...taskData,
    created_by: userId
  });

  return task;
};


export const getAllTasks = async () => {
  const tasks = await Task.findAll();

  return tasks;
};


export const getTaskById = async (id) => {
  const task = await Task.findByPk(id);

  if (!task) {
    return null;
  }

  return task;
};


export const updateTask = async (id, taskData) => {
  const task = await Task.findByPk(id);

  if (!task) {
    return null;
  }

  await task.update(taskData);

  return task;
};


export const deleteTask = async (id) => {
  const task = await Task.findByPk(id);

  if (!task) {
    return null;
  }

  await task.destroy();

  return task;
};

export const getTasksByProject = async (projectId) => {

  const tasks = await Task.findAll({
    where: {
      project_id: projectId
    },
    include: [
      {
        model: User,
        as: "responsable",
        attributes: ["nom", "prenom", "email","numero_telephone"]
      }
    ]
  });

  return tasks;
};