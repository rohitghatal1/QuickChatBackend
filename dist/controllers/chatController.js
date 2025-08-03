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
exports.sendMessage = exports.getRoomMessages = exports.getMyChatRooms = exports.getOrCreateRoom = void 0;
const ChatRoom_1 = __importDefault(require("../models/ChatRoom"));
const Message_1 = __importDefault(require("../models/Message"));
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
            populate: [
                {
                    path: "sender",
                    select: "username name email",
                },
                {
                    path: "receiver",
                    select: "username name email",
                },
            ],
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
        const messages = yield Message_1.default.find({ chatRoom: roomId })
            .sort({ createdAt: -1 })
            .populate("sender", "username name email")
            .populate("receiver", "username name email");
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("Error fetching messages: ", err.message);
        res.status(500).json({ status: "failed", message: "Server error" });
    }
});
exports.getRoomMessages = getRoomMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, content } = req.body;
    const senderId = req.user.id;
    if (!roomId || !content) {
        return res
            .status(400)
            .json({ status: "failed", message: "Missing fields" });
    }
    const chatRoom = yield ChatRoom_1.default.findById(roomId);
    if (!chatRoom) {
        return res
            .status(404)
            .json({ status: "failed", message: "Chat room not found" });
    }
    const receiverId = chatRoom.participants.find((id) => id.toString() !== senderId);
    const message = yield Message_1.default.create({
        chatRoom: roomId,
        sender: senderId,
        receiver: receiverId,
        content,
    });
    yield ChatRoom_1.default.findByIdAndUpdate(roomId, { lastMessage: message._id });
    const populatedMessage = yield Message_1.default.find({ _id: message._id })
        .populate("sender", "username")
        .populate("receiver", "username") // Populate receiver
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
// export const getMessages = async (req: any, res: any) => {
//   try {
//     const { userId } = req.params;
//     const currentUserId = req.user.id;
//     console.log("user id: ", req.user);
//     const messages = await Message.find({
//       $or: [
//         { sender: currentUserId, receiver: userId },
//         { sender: userId, receiver: currentUserId },
//       ],
//     })
//       .sort("timestamp")
//       .populate("sender receiver", "username");
//     res.json(messages);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const getMyMessages = async (req: any, res: any) => {
//   try {
//     const chats = await Message.find()
//       .populate("sender", "username")
//       .populate("receiver", "username");
//     if (chats.length === 0) {
//       return res
//         .status(404)
//         .json({ status: "failed", message: "No chats found" });
//     }
//     return res.status(200).json(chats);
//   } catch (err: any) {
//     console.log("Failed to get chats: ", err);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Internal Server Error" });
//   }
// };
