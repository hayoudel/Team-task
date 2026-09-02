import express from "express";
import {createRoleController,getAllRolesController,getRoleByIdController,updateRoleController,deleteRoleController} from "../controllers/roleControllers.js"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
const router = express.Router();

router.post("/",verifyToken,isAdmin,createRoleController);
router.get("/",verifyToken,isAdmin,getAllRolesController);
router.get("/:id",verifyToken,isAdmin,getRoleByIdController);
router.put("/:id",verifyToken,isAdmin,updateRoleController);
router.delete("/:id",verifyToken,isAdmin,deleteRoleController)



export default router; 