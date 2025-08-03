"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
const chatController_1 = require("../controllers/chatController");
router.post("/getOrCreateRoom", authMiddleware_1.verifyToken, chatController_1.getOrCreateRoom);
router.get("/room/getMyChatRooms", authMiddleware_1.verifyToken, chatController_1.getMyChatRooms);
router.get("/room/:roomId/messages", authMiddleware_1.verifyToken, chatController_1.getRoomMessages);
// router.get("/messages/:userId", verifyToken, getMessages);
// router.get("/message/getMyMessages", verifyToken, getMyMessages);
router.post("/sendMessage", authMiddleware_1.verifyToken, chatController_1.sendMessage);
exports.default = router;
