import ProjectUser from "../models/projectUserModels.js";
import Project from "../models/projetModels.js";
import User from "../models/userModels.js";
import Role from "../models/roleModels.js";



export const getAllProjectUsers = async () => {
  const projectUsers = await ProjectUser.findAll();

  return projectUsers;
};

export const getProjectById = async (id) => {
  const projectUser = await ProjectUser.findByPk(id);

  if (!projectUser) {
    return null;
  }

  return projectUser;
};

export const getProjectUserById = async (userId) => {
  const projectUsers = await ProjectUser.findAll({
    where: {
      users_id: userId,
    },
    include: [
      {
        model: Project,
      },
    ],
  });

return projectUsers.map((projectUser) => projectUser.project)
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
        attributes: ["id","nom", "prenom"]
      },
      {
        model: Role,
        attributes: ["id","nom"]
      }
    ]
  });

 return {
  project,
  members: members.map(member => ({
    id: String(member.id),
    userId: String(member.users_id),
    roleId: String(member.role_id),
    nom: member.User.nom,
    prenom: member.User.prenom,
    role: member.role.nom
  }))
};
};

export const addMembersToProject = async (projectId, members) => {

  const project = await Project.findByPk(projectId);

  if (!project) {
    return {
      error: "Projet non trouvé"
    };
  }

  for (const member of members) {

    const user = await User.findByPk(member.users_id);

    if (!user) {
      return {
        error: `L'utilisateur ${member.users_id} n'existe pas`
      };
    }

    const role = await Role.findByPk(member.role_id);

    if (!role) {
      return {
        error: `Le rôle ${member.role_id} n'existe pas`
      };
    }

    const alreadyMember = await ProjectUser.findOne({
      where: {
        project_id: projectId,
        users_id: member.users_id
      }
    });

    if (alreadyMember) {
      return {
        error: `L'utilisateur ${member.users_id} est déjà membre de ce projet`
      };
    }
  }

  const projectUsers = await ProjectUser.bulkCreate(
    members.map(member => ({
      project_id: projectId,
      users_id: member.users_id,
      role_id: member.role_id
    }))
  );

  return {
    projectUsers
  };
};

export const removeMemberFromProject = async (projectId, userId) => {

  const member = await ProjectUser.findOne({
    where: {
      project_id: projectId,
      users_id: userId
    }
  });

  if (!member) {
    return null;
  }

  await member.destroy();

  return member;
};