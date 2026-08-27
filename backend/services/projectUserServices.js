import ProjectUser from "../models/projectUserModels.js";

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