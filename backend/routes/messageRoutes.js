import express from "express";
import { getMessagesByProjectController, createMessageController } from "../controllers/messageControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { canAccessProjectChat } from "../middlewares/chatMiddleware.js";

const router = express.Router();

router.get("/project/:projectId", verifyToken, canAccessProjectChat, getMessagesByProjectController);
router.post("/", verifyToken, canAccessProjectChat, createMessageController);

export default router;