import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
const router = express.Router();
import {
  getOrCreateRoom,
  getMyChatRooms,
  getRoomMessages,
  // getMessages,
  // getMyMessages,
  sendMessage,
} from "../controllers/chatController";

router.post("/getOrCreateRoom", verifyToken, getOrCreateRoom);
router.get("/room/getMyChatRooms", verifyToken, getMyChatRooms);
router.get("/room/:roomId/messages", verifyToken, getRoomMessages);
// router.get("/messages/:userId", verifyToken, getMessages);
// router.get("/message/getMyMessages", verifyToken, getMyMessages);
router.post("/sendMessage", verifyToken, sendMessage);

export default router;
