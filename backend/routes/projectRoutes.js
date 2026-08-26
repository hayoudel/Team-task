import express from "express"
import {createProjectController,getAllProjectController, getProjectByIdController,updateProjectController,deleteProjectController} from "../controllers/projetControllers.js"

const router = express.Router();

router.post("/",createProjectController );
router.get("/", getAllProjectController);
router.get("/:id",getProjectByIdController);
router.put("/:id",updateProjectController);
router.delete("/:id",deleteProjectController);


export default router;