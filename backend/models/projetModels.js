import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Projet = sequelize.define("project", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Le nom est obligatoire.",
      },
    },
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "La description est obligatoire.",
      },
    },
  },
  statut: {
    type:DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "mettez un statut",
      },
    },

  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: false,
     validate: {
      notEmpty: {
        msg: "La date de debut est obligatoire.",
      },
    },
  },
   date_fin: {
    type: DataTypes.DATE,
    allowNull: false,
     validate: {
      notEmpty: {
        msg: "La date de fin  est obligatoire.",
      },
    },
  },

});

export default Projet;