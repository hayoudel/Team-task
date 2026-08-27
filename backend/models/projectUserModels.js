import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";



const ProjectUser = sequelize.define("project_user",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
  },
);

export default ProjectUser;