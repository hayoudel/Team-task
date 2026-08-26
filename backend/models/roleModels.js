import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";


const Role = sequelize.define("role",{
   id:{
    type:DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
   },
   nom: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate : {
        notEmpty: {
            msg: "nom requis"
        } 
    },
   },
})
export default Role; 