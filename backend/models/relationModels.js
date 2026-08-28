import ProjectUser from "../models/projectUserModels.js";
import Project from "../models/projetModels.js";
import User from "../models/userModels.js";
import Role from "../models/roleModels.js";
import Task from "../models/taskModels.js";


User.hasMany(ProjectUser, {
  foreignKey: "users_id",
});

ProjectUser.belongsTo(User, {
  foreignKey: "users_id",
   onDelete: 'CASCADE'
});


Project.hasMany(ProjectUser, {
  foreignKey: "project_id",
});

ProjectUser.belongsTo(Project, {
  foreignKey: "project_id",
   onDelete: 'CASCADE'
});


Role.hasMany(ProjectUser, {
  foreignKey: "role_id",
});

ProjectUser.belongsTo(Role, {
  foreignKey: "role_id",
   onDelete: 'RESTRICT'
});

Project.hasMany(Task, {
   foreignKey: "project_id", 
});

Task.belongsTo(Project, { 
  foreignKey: "project_id", 
  onDelete: "CASCADE", 
}); 

User.hasMany(Task, {
  foreignKey: "created_by",
  as: "tasksCreated"
});

Task.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
  onDelete: "RESTRICT"
});


User.hasMany(Task, {
  foreignKey: "responsable_id",
  as: "tasksAssigned"
});

Task.belongsTo(User, {
  foreignKey: "responsable_id",
  as: "responsable",
  onDelete: "RESTRICT"
});