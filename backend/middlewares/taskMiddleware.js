import Task from "../models/taskModels.js";
import ProjectUser from "../models/projectUserModels.js";


export const canManageTask = async (req, res, next) => {
  try {

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Tâche non trouvée"
      });
    }

   
    if (req.user.role === "admin") {
      req.task = task;
      return next();
    }

    if (task.created_by === req.user.userId) {
      req.task = task;
      return next();
    }

    return res.status(403).json({
      message: "Vous n'avez pas le droit de modifier ou supprimer cette tâche"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};


export const canCreateTask = async (req, res, next) => {
  try {
    const { project_id, responsable_id } = req.body;

  
    const responsable = await ProjectUser.findOne({
      where: {
        project_id,
        users_id: responsable_id
      }
    });

    if (!responsable) {
      return res.status(403).json({
        message: "Le responsable doit être membre du projet"
      });
    }

   
    if (req.user.role === "admin") {
      return next();
    }

   
    const member = await ProjectUser.findOne({
      where: {
        project_id,
        users_id: req.user.userId
      }
    });

    if (!member) {
      return res.status(403).json({
        message: "Vous n'êtes pas membre de ce projet"
      });
    }

   
    if (member.role_id === 1) {
      return next();
    }

    if (responsable_id !== req.user.userId) {
      return res.status(403).json({
        message: "Vous ne pouvez attribuer une tâche qu'à vous-même"
      });
    }

    next();

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

export const canUpdateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Tâche non trouvée"
      });
    }

    // Le responsable de la tâche peut modifier son statut
    if (task.responsable_id === req.user.userId) {
      req.task = task;
      return next();
    }

    // L'admin peut également modifier le statut
    if (req.user.role === "admin") {
      req.task = task;
      return next();
    }

    return res.status(403).json({
      message: "Vous ne pouvez modifier que le statut des tâches qui vous sont attribuées"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};