import ProjectUser from "../models/projectUserModels.js";
import Project from "../models/projetModels.js";
import User from "../models/userModels.js";
import Role from "../models/roleModels.js";

export const createProjectUser = async (projectUserData) => {
  const projectUser = await ProjectUser.create(projectUserData);

  return projectUser;
};

export const getAllProjectUsers = async () => {
  const projectUsers = await ProjectUser.findAll();

  return projectUsers;
};

export const getProjectUserById = async (id) => {
  const projectUser = await ProjectUser.findByPk(id);

  if (!projectUser) {
    return null;
  }

  return projectUser;
};

export const updateProjectUser = async (id, projectUserData) => {
  const projectUser = await ProjectUser.findByPk(id);

  if (!projectUser) {
    return null;
  }

  await projectUser.update(projectUserData);

  return projectUser;
};

export const deleteProjectUser = async (id) => {
  const projectUser = await ProjectUser.findByPk(id);

  if (!projectUser) {
    return null;
  }

  await projectUser.destroy();

  return projectUser;
};

export const getProjectMembers = async (projectId) => {

  const project = await Project.findByPk(projectId, {
    attributes: ["id", "nom"]
  });

  if (!project) {
    return null;
  }

  const members = await ProjectUser.findAll({
    where: {
      project_id: projectId
    },
    include: [
      {
        model: User,
        attributes: ["nom", "prenom"]
      },
      {
        model: Role,
        attributes: ["nom"]
      }
    ]
  });

  return {
    project,
    members: members.map(member => ({
      nom: member.User.nom,
      prenom: member.User.prenom,
      role: member.role.nom
        }))
  };
};