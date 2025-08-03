import path from "path";
import ChatRoom from "../models/ChatRoom";
import Message from "../models/Message";
import User from "../models/User";
import { populate } from "dotenv";
import mongoose from "mongoose";

export const getOrCreateRoom = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.body;

    let room = await ChatRoom.findOne({
      isGroup: false,
      participants: { $all: [userId, receiverId], $size: 2 },
    });

    if (!room) {
      room = await ChatRoom.create({
        isGroup: false,
        participants: [userId, receiverId],
      });
    }

    res.json(room);
  } catch (err: any) {
    res.status(500).json({
      status: "failed",
      message: "Failed to get or create room",
      error: err.message,
    });
  }
};

export const getMyChatRooms = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const chatRooms = await ChatRoom.find({
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
  } catch (err: any) {
    console.error("Error fetching chat rooms: ", err.message);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch chat rooms",
      error: err.message,
    });
  }
};

export const getRoomMessages = async (req: any, res: any) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ chatRoom: roomId })
      .sort({ createdAt: -1 })
      .populate("sender", "username name email")
      .populate("receiver", "username name email");

    res.status(200).json(messages);
  } catch (err: any) {
    console.error("Error fetching messages: ", err.message);
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

import admin from "../managers/firebase"; // adjust path if needed

export const sendMessage = async (req: any, res: any) => {
  try {
    const { roomId, content } = req.body;
    const senderId = req.user.id;

    if (!roomId || !content) {
      return res
        .status(400)
        .json({ status: "failed", message: "Missing fields" });
    }

    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res
        .status(404)
        .json({ status: "failed", message: "Chat room not found" });
    }

    const receiverId = chatRoom.participants.find(
      (id: mongoose.Types.ObjectId) => id.toString() !== senderId
    );

    if (!receiverId) {
      return res.status(400).json({
        status: "failed",
        message: "Receiver not found in chat room",
      });
    }

    console.log("reached here");

    const senderUser = await User.findById(senderId);
    const topic = receiverId.toString(); // Use receiverId as topic
    const title = `New message from ${senderUser?.username || "Someone"}`;
    const body = content;
    // const image = ""; // or provide image URL if any

    console.log("topic ", topic);
    console.log("sender id ", senderUser);

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

    await ChatRoom.findByIdAndUpdate(roomId, { lastMessage: message._id });

    const populatedMessage = await Message.find({ _id: message._id })
      .populate("sender", "username")
      .populate("receiver", "username")
      .populate({
        path: "chatRoom",
        populate: {
          path: "lastMessage",
          populate: { path: "sender", select: "username" },
        },
      });

    res.json(populatedMessage[0]);
  } catch (err: any) {
    console.error("Send Message Error:", err.message);
    res
      .status(500)
      .json({ status: "failed", message: "Server error", error: err.message });
  }
};

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
