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
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const express = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const authRoutes_2 = __importDefault(require("./admin/routes/authRoutes"));
dotenv_1.default.config();
const app = express();
const server = http.createServer(app);
//middleware
app.use(cors());
app.use(express.json());
const database_1 = __importDefault(require("./config/database"));
const ChatRoom_1 = __importDefault(require("./models/ChatRoom"));
const Message_1 = __importDefault(require("./models/Message"));
const User_1 = __importDefault(require("./models/User"));
const firebase_1 = __importDefault(require("./managers/firebase"));
(0, database_1.default)();
//Routes
app.get("/", (req, res) => {
    res.send("QuickChat backend is running!");
});
// user routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.use("/api/users/", userRoutes_1.default);
//group routes
app.use("/api/groups/", groupRoutes_1.default);
// admin routes
app.use("/api/admin", authRoutes_2.default);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCh", "DELETE"],
    },
});
io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);
    // Join a room (chatRoom._id)
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    // Receive and broadcast message
    socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId, content, senderId } = data;
        const chatRoom = yield ChatRoom_1.default.findById(roomId);
        if (!chatRoom)
            return;
        const receiverId = chatRoom.participants.find((id) => id.toString() !== senderId);
        if (!receiverId) {
            return "Receiver not found in chat room";
        }
        const senderUser = yield User_1.default.findById(senderId);
        const topic = receiverId.toString(); // Use receiverId as topic
        const title = `New message from ${(senderUser === null || senderUser === void 0 ? void 0 : senderUser.username) || "Someone"}`;
        const body = content;
        // const image = ""; // or provide image URL if any
        console.log("topic ", topic);
        const pushMessage = {
            topic: topic,
            notification: { title, body },
            // data: {
            //   title,
            //   topic,
            //   body,
            //   image,
            //   // attachment,
            // },
        };
        try {
            yield firebase_1.default.messaging().send(pushMessage);
        }
        catch (pushErr) {
            console.error("Push Notification Error:", pushErr);
        }
        const message = yield Message_1.default.create({
            chatRoom: roomId,
            sender: senderId,
            receiver: receiverId,
            content,
        });
        chatRoom.lastMessage = message._id;
        yield chatRoom.save();
        const populatedMessage = yield Message_1.default.findById(message._id)
            .populate("sender", "username name email")
            .populate("receiver", "username name email");
        // Emit to all users in the room
        io.to(roomId).emit("receive_message", populatedMessage);
    }));
    socket.on("typing", (roomId) => {
        socket.to(roomId).emit("user_typing", {
            userId: socket.userId,
            username: socket.user.username,
        });
    });
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
app.use(errorHandler_1.default);
