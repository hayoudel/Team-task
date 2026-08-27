import Task from "../models/taskModels.js";


export const createTask = async (taskData) => {
  const task = await Task.create(taskData);

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

