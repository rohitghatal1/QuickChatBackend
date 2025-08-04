import express from "express";
import { deleteMessage, getMessages } from "../controllers/messageControllers";

const router = express.Router();

router.get("/getMessages", getMessages);
router.delete("/deleteMessage/:messageId", deleteMessage);

export default router;
