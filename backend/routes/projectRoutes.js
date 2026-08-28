import express from "express"
import {createProjectController,getAllProjectController, getProjectByIdController,updateProjectController,deleteProjectController} from "../controllers/projetControllers.js"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
const router = express.Router();

router.post( "/", verifyToken, isAdmin, createProjectController );
router.get("/",verifyToken, getAllProjectController);
router.get("/:id",getProjectByIdController);
router.put("/:id",updateProjectController);
router.delete("/:id",deleteProjectController);


export default router;