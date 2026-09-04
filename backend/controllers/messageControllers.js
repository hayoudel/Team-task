import { createMessage, getMessagesByProject } from "../services/messageServices.js";

export const getMessagesByProjectController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = await getMessagesByProject(projectId);
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createMessageController = async (req, res) => {
  try {
    const {
      project_id,
      contenu,
      reply_to_id,
    } = req.body;

    const senderId = req.user.userId;

    if (!project_id || !contenu) {
      return res.status(400).json({
        message: "project_id et contenu sont requis",
      });
    }

    const message = await createMessage(
      project_id,
      senderId,
      contenu,
      reply_to_id ?? null
    );

    const io = req.app.get("io");

    if (io) {
      io.to(`project_${project_id}`).emit(
        "newMessage",
        message
      );
    }

    return res.status(201).json(message);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};