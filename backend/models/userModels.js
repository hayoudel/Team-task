import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
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

  prenom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Le prénom est obligatoire.",
      },
    },
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "L'email doit être valide.",
      },
    },
  },

  motDePasse: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
numero_telephone: {
  type: DataTypes.STRING(20),
  allowNull: false,
  unique: true,
  validate: {
    notEmpty: {
      msg: "Le numéro est obligatoire"
    }
  }
},

 role: {
  type: DataTypes.STRING(50),
  allowNull: false,
  defaultValue: "user",
}
});

export default User;