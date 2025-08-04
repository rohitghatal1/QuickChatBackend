import express from "express";
import { deleteUser, getAllUsers } from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/getUsers", getAllUsers);
router.delete("/deleteUser/:userId", deleteUser);

export default router;
