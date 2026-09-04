import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Message = sequelize.define("message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Le message ne peut pas être vide.",
      },
    },
  },

  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "projects",
      key: "id",
    },
  },

  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  reply_to_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "messages",
      key: "id",
    },
  },
});

export default Message;