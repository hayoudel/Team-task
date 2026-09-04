import Message from "../models/messageModels.js";
import User from "../models/userModels.js";

export const createMessage = async (
  projectId,
  senderId,
  contenu,
  replyToId = null
) => {

  const message = await Message.create({
    project_id: projectId,
    sender_id: senderId,
    contenu,
    reply_to_id: replyToId,
  });

  const messageWithSender = await Message.findByPk(message.id, {
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "nom", "prenom"],
      },
      {
        model: Message,
        as: "messageRepondu",
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "nom", "prenom"],
          },
        ],
      },
    ],
  });

  return messageWithSender;
};

export const getMessagesByProject = async (projectId) => {

  const messages = await Message.findAll({
    where: { project_id: projectId },

    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "nom", "prenom"],
      },

      {
        model: Message,
        as: "messageRepondu",
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "nom", "prenom"],
          },
        ],
      },
    ],

    order: [["createdAt", "ASC"]],
  });

  return messages;
};