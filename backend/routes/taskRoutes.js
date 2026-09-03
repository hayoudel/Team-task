import express from "express";

import { createTaskController, getAllTasksController, getTaskByIdController, updateTaskController, deleteTaskController,getTasksByProjectController,updateTaskStatusController,getMyTasksController } from "../controllers/taskControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {canManageTask,canCreateTask,canUpdateTaskStatus} from "../middlewares/taskMiddleware.js";
const router = express.Router();

router.post("/",verifyToken, canCreateTask,createTaskController);
router.get("/", getAllTasksController);
router.get("/project/:projectId",verifyToken,getTasksByProjectController);
router.get(
  "/my-tasks",verifyToken,
  getMyTasksController
);
router.get("/:id", getTaskByIdController);

router.patch("/:id/status",verifyToken,canUpdateTaskStatus,updateTaskStatusController
);
router.put("/:id", verifyToken, canManageTask, updateTaskController);
router.delete("/:id", verifyToken, canManageTask, deleteTaskController);


export default router;
