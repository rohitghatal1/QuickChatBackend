import path from "path";
import ChatRoom from "../models/ChatRoom";
import Message from "../models/Message";
import User from "../models/User";
import { populate } from "dotenv";

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
        populate: {
          path: "sender",
          select: "username",
        },
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

    console.log("room messges fetched with id: ", roomId);
    const messages = await Message.find({ chatRoom: roomId })
      .sort({ createdAt: -1 })
      .populate({
        path: "sender",
        select: "username name email",
      })
      .lean();

    const formattedMessage = messages.map((msg: any) => ({
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
  } catch (err: any) {
    console.error("Error fetching messages: ", err.message);
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

export const getMessages = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    console.log("user id: ", req.user);

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort("timestamp")
      .populate("sender receiver", "username");

    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyMessages = async (req: any, res: any) => {
  try {
    const chats = await Message.find()
      .populate("sender", "username")
      .populate("receiver", "username");

    if (chats.length === 0) {
      return res
        .status(404)
        .json({ status: "failed", message: "No chats found" });
    }

    return res.status(200).json(chats);
  } catch (err: any) {
    console.log("Failed to get chats: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

export const sendMessage = async (req: any, res: any) => {
  const { roomId, content } = req.body;
  const senderId = req.user.id;

  if (!roomId || !content) {
    return res
      .status(400)
      .json({ status: "failed", message: "Missing fields" });
  }
  console.log(
    "send message called with room id and content: ",
    roomId,
    content
  );

  const message = await Message.create({
    chatRoom: roomId,
    sender: senderId,
    content,
  });

  await ChatRoom.findByIdAndUpdate(roomId, { lastMessage: message._id });

  const populatedMessage = await Message.find({ _id: message._id })
    .populate("sender", "username")
    .populate({
      path: "chatRoom",
      populate: {
        path: "lastMessage",
        populate: { path: "sender", select: "username" },
      },
    });

  res.json(populatedMessage[0]);
};

export const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
