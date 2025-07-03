import Message from "../../models/Message";

export const getMessages = async (req: any, res: any) => {
  try {
    const messages = await Message.find();

    if (!messages) {
      return res
        .status(404)
        .json({ status: "failed", message: "No messages found" });
    }

    return res.status(200).json(messages);
  } catch (err: any) {
    res.status(500).json({ status: "Failed", message: "Serve error" });
  }
};

export const deleteMessage = async (req: any, res: any) => {
  try {
    const { messageId } = req.body;

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
