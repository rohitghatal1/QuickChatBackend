import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/user', chatController.getUsers);
router.get('/messages/:userId', verifyToken, chatController.getMessages);
router.get('/message/getMyMessages', verifyToken, chatController.getMyMessages)
router.post("/sendMessage", verifyToken, chatController.sendMessage)

export default router;