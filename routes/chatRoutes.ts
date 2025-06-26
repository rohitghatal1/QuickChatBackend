import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/user", chatController.getUsers);
router.post("/getOrCreateRoom", verifyToken, chatController.getOrCreateRoom);
router.get("/room/getMyChatRooms", verifyToken, chatController.getMyChatRooms);
router.get(
  "/room/:roomId/messages",
  verifyToken,
  chatController.getRoomMessages
);
router.get("/messages/:userId", verifyToken, chatController.getMessages);
router.get("/message/getMyMessages", verifyToken, chatController.getMyMessages);
router.post("/sendMessage", verifyToken, chatController.sendMessage);

export default router;
