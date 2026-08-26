import Project  from "../models/projetModels.js";


export const createProject = async (projectData) => {
  const project = await Project.create(projectData)
  return project;
};


export const getAllProject = async () => {
  const project = await Project.findAll();
  return project;
};

export const getProjectById = async (id) => {
  const project = await Project.findByPk(id);

  if (!project) {
    return null;
  }
  return project;
};

export const updateProject = async (id,projectData) => {
    const project = await Project.findByPk(id);

    if (!project) {
    return null;
  }

  await project.update(projectData);
  return project;
};

export const deleteProject = async (id) => {
    const project = await Project.findByPk(id);
    
    if (!project) {
    return null;
  }
  await project.destroy();
  return project;
};