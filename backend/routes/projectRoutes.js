import express from "express"
import {createProjectController,getAllProjectController, getProjectByIdController,updateProjectController,deleteProjectController} from "../controllers/projetControllers.js"
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/",createProjectController );
router.get("/",verifyToken, getAllProjectController);
router.get("/:id",getProjectByIdController);
router.put("/:id",updateProjectController);
router.delete("/:id",deleteProjectController);


export default router;