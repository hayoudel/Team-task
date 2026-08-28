import express from "express";

import {createProjectUserController,getAllProjectUsersController,getProjectUserByIdController, updateProjectUserController,deleteProjectUserController,getProjectMembersController
} from "../controllers/projectUserControllers.js";

const router = express.Router();

router.post("/", createProjectUserController);
router.get("/", getAllProjectUsersController);
router.get("/:id", getProjectUserByIdController);
router.put("/:id", updateProjectUserController);
router.delete("/:id", deleteProjectUserController);
router.get("/project/:projectId",getProjectMembersController
);

export default router;