import Task from "../models/taskModels.js";
import User from "../models/userModels.js";


export const createTask = async (taskData, userId) => {
  const task = await Task.create({ ...taskData, created_by: userId });

  const taskWithResponsable = await Task.findByPk(task.id, {
    include: [
      {
        model: User,
        as: "responsable",
        attributes: ["nom", "prenom", "email", "numero_telephone"],
      },
    ],
  });

  return taskWithResponsable;
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
      },
      {
      model: User,
      as: "creator",
      attributes: [
        "id",
        "nom",
        "prenom",
        "email",
        "numero_telephone"
      ]
    }
    ]
  });

  return tasks;
};
export const updateTaskStatus = async (id, statut, userId) => {
  const task = await Task.findByPk(id);

  if (!task) {
    return null;
  }

  // Vérifie que l'utilisateur connecté
  // est bien le responsable de la tâche
  if (task.responsable_id !== userId) {
    const error = new Error(
      "Vous ne pouvez modifier que le statut des tâches qui vous sont attribuées."
    );

    error.statusCode = 403;
    throw error;
  }

  await task.update({ statut });

  return task;
};
export const getMyTasks = async (userId) => {
  const tasks = await Task.findAll({
    where: {
      responsable_id: userId
    },
    include: [
      {
        model: User,
        as: "responsable",
        attributes: [
          "id",
          "nom",
          "prenom",
          "email",
          "numero_telephone"
        ]
      },
      {
        model: User,
        as: "creator",
        attributes: [
          "id",
          "nom",
          "prenom",
          "email",
          "numero_telephone"
        ]
      }
    ]
  });

  return tasks;
};