import express from "express";

import {getAllProjectUsersController,getProjectByIdController,getProjectUserByIdController, updateProjectUserController,deleteProjectUserController,getProjectMembersController,addMembersToProjectController,removeMemberFromProjectController
} from "../controllers/projectUserControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
const router = express.Router();


router.get("/",verifyToken,isAdmin, getAllProjectUsersController);
router.get("/:id",verifyToken,isAdmin, getProjectByIdController);
router.get("/user/:userId",verifyToken, getProjectUserByIdController);
router.put("/:id", updateProjectUserController);
router.delete("/:id", deleteProjectUserController);
router.get("/project/:projectId",getProjectMembersController);
router.post("/",verifyToken,isAdmin,addMembersToProjectController);
router.delete( "/project/:projectId/user/:userId",verifyToken,isAdmin,removeMemberFromProjectController);


export default router;