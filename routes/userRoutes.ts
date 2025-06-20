import express from 'express';
import { changePassword, getCurrentUser, getUserById, getUsers, uppdateProfile } from '../controllers/userController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/auth/me", verifyToken, getCurrentUser)
router.get("/getUsers/:id", getUserById);
router.patch('/user/changePassword', changePassword);
router.patch('/user/updatedProfiile', uppdateProfile);

export default router