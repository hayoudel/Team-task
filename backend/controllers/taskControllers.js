import {createTask,getAllTasks, getTaskById, updateTask,deleteTask,getTasksByProject,updateTaskStatus,getMyTasks } from "../services/taskServices.js";


export const createTaskController = async (req, res) => {
  try {
  
    const task = await createTask(
  req.body,
  req.user.userId
  );

    res.status(201).json({
      message: "Tâche créée ",
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
      message: "Tâches récupérées ",
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
      message: "Tâche récupérée ",
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
      message: "Tâche modifiée ",
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
      message: "Tâche supprimée "
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getTasksByProjectController = async (req, res) => {
  try {

    const tasks = await getTasksByProject(req.params.projectId);

    res.status(200).json({
      message: "Tâches du projet récupérées ",
      tasks
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const updateTaskStatusController = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!statut) {
      return res.status(400).json({
        message: "Le statut est obligatoire"
      });
    }

    const task = await updateTaskStatus(
      req.params.id,
      statut,
      req.user.userId
    );

    if (!task) {
      return res.status(404).json({
        message: "Tâche non trouvée"
      });
    }

    res.status(200).json({
      message: "Statut de la tâche modifié",
      task
    });

  } catch (error) {

    if (error.statusCode === 403) {
      return res.status(403).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};
export const getMyTasksController = async (req, res) => {
  try {
    const tasks = await getMyTasks(req.user.userId);

    res.status(200).json({
      message: "Mes tâches récupérées",
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};