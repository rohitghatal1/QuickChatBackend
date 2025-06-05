import express from 'express';
import { changePassword, getUserById, getUsers, uppdateProfile } from '../controllers/userController';

const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/getUsers/:id", getUserById);
router.patch('/user/changePassword', changePassword);
router.patch('/user/updatedProfiile', uppdateProfile);

export default router