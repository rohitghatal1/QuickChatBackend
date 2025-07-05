import express from "express";
import { createGroup, sendGroupMessage } from "../controllers/groupController";

const router = express.Router();

router.post("/createGroup", createGroup);
router.get("/sendGroupMessage", sendGroupMessage);

export default router;
