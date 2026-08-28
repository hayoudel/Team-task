import { createProjectUser, getAllProjectUsers, getProjectUserById, updateProjectUser, deleteProjectUser,getProjectMembers
} from "../services/projectUserServices.js";


export const createProjectUserController = async (req, res) => {
  try {
    const projectUser = await createProjectUser(req.body);

    res.status(201).json({
      message: "Utilisateur ajouté au projet avec succès",
      projectUser
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


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


export const getProjectUserByIdController = async (req, res) => {
  try {
    const projectUser = await getProjectUserById(req.params.id);

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