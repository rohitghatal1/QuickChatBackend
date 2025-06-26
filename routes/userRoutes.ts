import express from "express";
import {
  changePassword,
  getCurrentUser,
  getUserById,
  getUsers,
  updateProfile,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/auth/me", verifyToken, getCurrentUser);
router.get("/getUsers/:id", getUserById);
router.patch("/changePassword", changePassword);
router.patch("/updateProfile", updateProfile);

export default router;
