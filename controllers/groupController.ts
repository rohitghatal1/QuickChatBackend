import { populate } from "dotenv";
import ChatRoom from "../models/ChatRoom";
import Message from "../models/Message";

export const createGroup = async (req: any, res: any) => {
  const currentUserId = req.user.id;
  const { groupName, participantIds } = req.body;

  if (!groupName || !participantIds || participantIds.length < 2) {
    return res.json({
      status: "failed",
      message: "Group name and at least 2 members are required",
    });
  }

  try {
    if (!participantIds.includes(currentUserId)) {
      participantIds.push(currentUserId);
    }

    const group = new ChatRoom({
      name: groupName,
      participants: participantIds,
      isGroup: true,
      admin: currentUserId,
    });

    const savedGroup = await group.save();

    res.status(201).json({
      status: "success",
      message: "Group created Successfylly",
      group: savedGroup,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const sendGroupMessage = async (req: any, res: any) => {
  const { roomId, content } = req.body;
  const senderId = req.user?.id || req.body.senderId;

  if (!roomId || !senderId || !content) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const message = await Message.create({
      chatRoom: roomId,
      sender: senderId,
      content,
    });

    await ChatRoom.findByIdAndUpdate(roomId, {
      lastMessage: message._id,
    });

    const populatedMessage = await Message.findOne({
      _id: message._id,
    }).populate("sender", "username name email");

    return res.status(201).json(populatedMessage);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};
