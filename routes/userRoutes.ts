import express from 'express';
import { getUserById, getUsers } from '../controllers/userController';

const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/getUsers/:id", getUserById);

export default router