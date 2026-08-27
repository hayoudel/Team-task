import {createTask,getAllTasks, getTaskById, updateTask,deleteTask } from "../services/taskServices.js";


export const createTaskController = async (req, res) => {
  try {
    const task = await createTask(req.body);

    res.status(201).json({
      message: "Tâche créée avec succès",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getAllTasksController = async (req, res) => {
  try {
    const tasks = await getAllTasks();

    res.status(200).json({
      message: "Tâches récupérées avec succès",
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getTaskByIdController = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Tâche non trouvée"
      });
    }

    res.status(200).json({
      message: "Tâche récupérée avec succès",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const updateTaskController = async (req, res) => {
  try {

    if ("id" in req.body) {
      return res.status(403).json({
        message: "L'id ne peut pas être modifié"
      });
    }

    const taskUpdate = await updateTask(
      req.params.id,
      req.body
    );

    if (!taskUpdate) {
      return res.status(404).json({
        message: "Tâche non trouvée"
      });
    }

    res.status(200).json({
      message: "Tâche modifiée avec succès",
      task: taskUpdate
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const deleteTaskController = async (req, res) => {
  try {
    const taskDelete = await deleteTask(req.params.id);

    if (!taskDelete) {
      return res.status(404).json({
        message: "Tâche non trouvée"
      });
    }

    res.status(200).json({
      message: "Tâche supprimée avec succès"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

