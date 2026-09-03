import express from "express";
import { createUserController,getAllUsersController,getUserByIdController,updateUserController,deleteUserController,loginController,logoutController,getMeController,changePasswordController } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createUserController);
router.get("/", getAllUsersController);
router.get("/me", verifyToken, getMeController);
router.get ("/:id", getUserByIdController);
router.put("/change-password",verifyToken,changePasswordController);
router.put("/:id",updateUserController);
router.delete("/:id",deleteUserController);
router.post("/login",loginController);
router.post("/logout", logoutController);

export default router;