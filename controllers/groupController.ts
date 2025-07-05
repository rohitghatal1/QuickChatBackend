import ChatRoom from "../models/ChatRoom";
import Message from "../models/Message";

export const createGroup = async (req: any, res: any) => {
  const currentUserId = req.params.id;
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
  const { chatRoomId, senderId, content } = req.body;

  if (!chatRoomId || !senderId || !content) {
    return res.status(400).json({
      message: "Missing requried fileds",
    });
  }

  try {
    const message = await Message.create({
      chatRoom: chatRoomId,
      sender: senderId,
      content: content,
    });

    await ChatRoom.findByIdAndUpdate(chatRoomId, { lastMessage: message._id });

    res
      .status(201)
      .jason({ status: "success", message: "Message sent successfully" });
  } catch (err: any) {
    res.status(500).json({ status: "failed", message: err });
  }
};
