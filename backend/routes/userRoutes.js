import express from "express";
import { createUserController,getAllUsersController,getUserByIdController,updateUserController,deleteUserController,loginController } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/", createUserController);
router.get("/", getAllUsersController);
router.get ("/:id", getUserByIdController);
router.put("/:id",updateUserController);
router.delete("/:id",deleteUserController);
router.post("/login",loginController);

export default router;