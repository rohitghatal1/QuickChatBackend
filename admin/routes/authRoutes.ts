import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { adminLogin, adminRegister } from '../controllers/authControllers';

const router = express.Router();

router.post("/register", verifyToken, adminRegister)
router.post("/login", verifyToken, adminLogin );


export default router