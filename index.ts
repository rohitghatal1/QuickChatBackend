import errorHandler from "./utils/errorHandler";
const express = require("express");
import dotenv from "dotenv";
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import userRoutes from "./routes/userRoutes";

import groupRoutes from "./routes/groupRoutes";

import adminAuthRoutes from "./admin/routes/authRoutes";

dotenv.config();
const app = express();
const server = http.createServer(app);

//middleware
app.use(cors());
app.use(express.json());

import connectDB from "./config/database";
import { createGroup } from "./controllers/groupController";
import ChatRoom from "./models/ChatRoom";
import Message from "./models/Message";
import mongoose from "mongoose";
import adminAddAnnouncement from "./controllers/amindddd";
import User from "./models/User";
import admin from "./managers/firebase";

import adminUserRoutes from "./admin/routes/userRoutes";
import adminMessageRoutes from "./admin/routes/messageRoutes";
connectDB();

//Routes
app.get("/", (req: any, res: any) => {
  res.send("QuickChat backend is running!");
});

// user routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users/", userRoutes);

//group routes
app.use("/api/groups/", groupRoutes);

// admin routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/user", adminUserRoutes);
app.use("/api/admin/message", adminMessageRoutes);

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCh", "DELETE"],
  },
});

io.on("connection", (socket: any) => {
  console.log("🔌 User connected:", socket.id);

  // Join a room (chatRoom._id)
  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Receive and broadcast message
  socket.on("send_message", async (data: any) => {
    const { roomId, content, senderId } = data;

    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) return;

    const receiverId = chatRoom.participants.find(
      (id: any) => id.toString() !== senderId
    );
    if (!receiverId) {
      return "Receiver not found in chat room";
    }

    const senderUser = await User.findById(senderId);

    const topic = receiverId.toString(); // Use receiverId as topic
    const title = `New message from ${senderUser?.username || "Someone"}`;
    const body = content;
    // const image = ""; // or provide image URL if any

    console.log("topic ", topic);

    const pushMessage: admin.messaging.Message = {
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
      await admin.messaging().send(pushMessage);
    } catch (pushErr) {
      console.error("Push Notification Error:", pushErr);
    }

    const message = await Message.create({
      chatRoom: roomId,
      sender: senderId,
      receiver: receiverId,
      content,
    });

    chatRoom.lastMessage = message._id as mongoose.Types.ObjectId;
    await chatRoom.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username name email")
      .populate("receiver", "username name email");

    // Emit to all users in the room
    io.to(roomId).emit("receive_message", populatedMessage);
  });

  socket.on("typing", (roomId: string) => {
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

app.use(errorHandler);
