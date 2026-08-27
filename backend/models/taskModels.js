import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Task = sequelize.define("task", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nom: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Le nom de la tâche est obligatoire."
      }
    }
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "La description est obligatoire."
      }
    }
  },

  statut: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "A faire",
    validate: {
      notEmpty: {
        msg: "Le statut est obligatoire."
      }
    }
  },

  date_debut: {
    type: DataTypes.DATE,
    allowNull: false
  },

  date_fin: {
    type: DataTypes.DATE,
    allowNull: false
  },

  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "projects",
      key: "id"
    },
  },

  users_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id"
    },
  }

});

export default Task;

