"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.sendMessage = exports.getMyMessages = exports.getMessages = exports.getRoomMessages = exports.getMyChatRooms = exports.getOrCreateRoom = void 0;
const ChatRoom_1 = __importDefault(require("../models/ChatRoom"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const getOrCreateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { receiverId } = req.body;
        let room = yield ChatRoom_1.default.findOne({
            isGroup: false,
            participants: { $all: [userId, receiverId], $size: 2 },
        });
        if (!room) {
            room = yield ChatRoom_1.default.create({
                isGroup: false,
                participants: [userId, receiverId],
            });
        }
        res.json(room);
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Failed to get or create room",
            error: err.message,
        });
    }
});
exports.getOrCreateRoom = getOrCreateRoom;
const getMyChatRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const chatRooms = yield ChatRoom_1.default.find({
            participants: userId,
        })
            .populate({
            path: "participants",
            select: "username name email",
        })
            .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "username",
            },
        })
            .sort({ updatedAt: -1 });
        res.status(200).json(chatRooms);
    }
    catch (err) {
        console.error("Error fetching chat rooms: ", err.message);
        res.status(500).json({
            status: "failed",
            message: "Failed to fetch chat rooms",
            error: err.message,
        });
    }
});
exports.getMyChatRooms = getMyChatRooms;
const getRoomMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        console.log("room messges fetched with id: ", roomId);
        const messages = yield Message_1.default.find({ chatRoom: roomId })
            .sort({ createdAt: -1 })
            .populate({
            path: "sender",
            select: "username name email",
        })
            .lean();
        const formattedMessage = messages.map((msg) => ({
            _id: msg._id,
            chatRoom: msg.chatRoom,
            sender: {
                id: msg.sender._id,
                username: msg.sender.username,
                name: msg.sender.name,
                email: msg.sender.email,
            },
            content: msg.content,
            readBy: msg.readBy || [],
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
        }));
        res.status(200).json(formattedMessage);
        console.log("response sent with: ", messages);
    }
    catch (err) {
        console.error("Error fetching messages: ", err.message);
        res.status(500).json({ status: "failed", message: "Server error" });
    }
});
exports.getRoomMessages = getRoomMessages;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;
        console.log("user id: ", req.user);
        const messages = yield Message_1.default.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId },
            ],
        })
            .sort("timestamp")
            .populate("sender receiver", "username");
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getMessages = getMessages;
const getMyMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield Message_1.default.find()
            .populate("sender", "username")
            .populate("receiver", "username");
        if (chats.length === 0) {
            return res
                .status(404)
                .json({ status: "failed", message: "No chats found" });
        }
        return res.status(200).json(chats);
    }
    catch (err) {
        console.log("Failed to get chats: ", err);
        return res
            .status(500)
            .json({ status: "error", message: "Internal Server Error" });
    }
});
exports.getMyMessages = getMyMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, content } = req.body;
    const senderId = req.user.id;
    if (!roomId || !content) {
        return res
            .status(400)
            .json({ status: "failed", message: "Missing fields" });
    }
    console.log("send message called with room id and content: ", roomId, content);
    const message = yield Message_1.default.create({
        chatRoom: roomId,
        sender: senderId,
        content,
    });
    yield ChatRoom_1.default.findByIdAndUpdate(roomId, { lastMessage: message._id });
    const populatedMessage = yield Message_1.default.find({ _id: message._id })
        .populate("sender", "username")
        .populate({
        path: "chatRoom",
        populate: {
            path: "lastMessage",
            populate: { path: "sender", select: "username" },
        },
    });
    res.json(populatedMessage[0]);
});
exports.sendMessage = sendMessage;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({ _id: { $ne: req.user._id } }).select("-password");
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getUsers = getUsers;
