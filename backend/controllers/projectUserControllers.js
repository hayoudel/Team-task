import {  getAllProjectUsers, getProjectById,getProjectUserById, updateProjectUser, deleteProjectUser,getProjectMembers,addMembersToProject,removeMemberFromProject
} from "../services/projectUserServices.js";


export const getAllProjectUsersController = async (req, res) => {
  try {
    const projectUsers = await getAllProjectUsers();

    res.status(200).json({
      message: "Les membres des projets ont été récupérés avec succès",
      projectUsers
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getProjectByIdController = async (req, res) => {
  try {
    const projectUser = await getProjectById(req.params.id);

    if (!projectUser) {
      return res.status(404).json({
        message: "Association utilisateur/projet non trouvée"
      });
    }

    res.status(200).json({
      message: "Association récupérée avec succès",
      projectUser
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getProjectUserByIdController = async (req, res) => {
  try {
    const projects = await getProjectUserById(req.params.userId);

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        message: "Cet utilisateur n'appartient à aucun projet",
      });
    }

    return res.status(200).json({
      message: "Projets de l'utilisateur récupérés avec succès",
      project: projects,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProjectUserController = async (req, res) => {
  try {

    if ("id" in req.body) {
      return res.status(403).json({
        message: "L'id ne peut pas être modifié"
      });
    }

    const projectUserUpdate = await updateProjectUser(
      req.params.id,
      req.body
    );

    if (!projectUserUpdate) {
      return res.status(404).json({
        message: "Association utilisateur/projet non trouvée"
      });
    }

    res.status(200).json({
      message: "Association modifiée avec succès",
      projectUser: projectUserUpdate
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const deleteProjectUserController = async (req, res) => {
  try {
    const projectUserDelete = await deleteProjectUser(req.params.id);

    if (!projectUserDelete) {
      return res.status(404).json({
        message: "Association utilisateur/projet non trouvée"
      });
    }

    res.status(200).json({
      message: "Utilisateur retiré du projet avec succès"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getProjectMembersController = async (req, res) => {
  try {

    const result = await getProjectMembers(req.params.projectId);

    if (!result) {
      return res.status(404).json({
        message: "Projet non trouvé"
      });
    }

    res.status(200).json({
      message: "Membres du projet récupérés avec succès",
      project: result.project,
      members: result.members
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
export const addMembersToProjectController = async (req, res) => {

  try {

    const { project_id, members } = req.body;

    if (!project_id || !members || !Array.isArray(members)) {
      return res.status(400).json({
        message: "project_id et members sont obligatoires"
      });
    }

    const result = await addMembersToProject(
      project_id,
      members
    );

    if (result.error) {
      return res.status(400).json({
        message: result.error
      });
    }

    res.status(201).json({
      message: "Membres ajoutés au projet avec succès",
      members: result.projectUsers
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
export const removeMemberFromProjectController = async (req, res) => {

  try {

    const { projectId, userId } = req.params;

    const member = await removeMemberFromProject(
      projectId,
      userId
    );

    if (!member) {
      return res.status(404).json({
        message: "Cet utilisateur n'est pas membre de ce projet"
      });
    }

    res.status(200).json({
      message: "Utilisateur retiré du projet avec succès"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};