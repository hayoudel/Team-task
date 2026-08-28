import express from "express";

import { createTaskController, getAllTasksController, getTaskByIdController, updateTaskController, deleteTaskController,getTasksByProjectController } from "../controllers/taskControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {canManageTask,canCreateTask} from "../middlewares/taskMiddleware.js";
const router = express.Router();

router.post("/",verifyToken, canCreateTask,createTaskController);
router.get("/", getAllTasksController);
router.get("/:id", getTaskByIdController);
router.put("/:id", verifyToken, canManageTask, updateTaskController);
router.delete("/:id", verifyToken, canManageTask, deleteTaskController);
router.get("/project/:projectId",verifyToken,getTasksByProjectController);

export default router;
