import express from "express";

import {createProjectUserController,getAllProjectUsersController,getProjectUserByIdController, updateProjectUserController,deleteProjectUserController
} from "../controllers/projectUserControllers.js";

const router = express.Router();

router.post("/", createProjectUserController);
router.get("/", getAllProjectUsersController);
router.get("/:id", getProjectUserByIdController);
router.put("/:id", updateProjectUserController);
router.delete("/:id", deleteProjectUserController);

export default router;