"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
const chatController = require('../controllers/chatController');
router.get('/user', chatController.getUsers);
router.get('/messages/:userId', authMiddleware_1.verifyToken, chatController.getMessages);
router.get('/message/getMyMessages', authMiddleware_1.verifyToken, chatController.getMyMessages);
router.post("/sendMessage", authMiddleware_1.verifyToken, chatController.sendMessage);
exports.default = router;
