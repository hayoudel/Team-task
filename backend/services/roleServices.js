import Role  from "../models/roleModels.js";


export const createRole = async (roleData) => {
  const role = await Role.create(roleData)
  return role;
};


export const getAllRole = async () => {
  const role = await Role.findAll();
  return role;
};


export const getRoleById = async (id) => {
  const role = await Role.findByPk(id);

  if (!role) {
    return null;
  }
  return role;
};

export const updateRole = async (id,roleData) => {
    const role = await Role.findByPk(id);

    if (!role) {
    return null;
  }

  await role.update(roleData);
  return role;
};

export const deleteRole = async (id) => {
    const role = await Role.findByPk(id);
    
    if (!role) {
    return null;
  }
  await role.destroy();
  return role;
};