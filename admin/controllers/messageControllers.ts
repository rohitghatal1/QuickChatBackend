import Message from "../../models/Message";

export const getMessages = async (req: any, res: any) => {
  try {
    const messages = await Message.find()
      .populate("sender", "name email") // or _id, name, etc. as needed
      .populate("receiver", "name email")
      .sort({ createdAt: -1 }); // optional: newest first

    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ status: "failed", message: "No messages found" });
    }

    return res.status(200).json(messages);
  } catch (err: any) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ status: "Failed", message: "Server error" });
  }
};

export const deleteMessage = async (req: any, res: any) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res
        .status(400)
        .json({ status: "failed", message: "Message ID required" });
    }

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res
        .status(404)
        .json({ status: "failed", message: "Message not found" });
    }

    res.json({
      status: "success",
      message: "Message deleted successfully",
    });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};
