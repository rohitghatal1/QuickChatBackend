import express from "express";
import { createGroup, sendGroupMessage } from "../controllers/groupController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/createGroup", verifyToken, createGroup);
router.get("/sendGroupMessage", verifyToken, sendGroupMessage);

export default router;
