import express from "express";
import {
  changePassword,
  getCurrentUser,
  getUsers,
  updateProfile,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/auth/me", verifyToken, getCurrentUser);
router.patch("/changePassword", verifyToken, changePassword);
router.patch("/updateProfile", verifyToken, updateProfile);

export default router;
