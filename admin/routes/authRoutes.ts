import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { adminLogin, adminRegister } from "../controllers/authControllers";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);

export default router;
