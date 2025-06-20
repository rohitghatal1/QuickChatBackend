import ChatRoom from "../models/ChatRoom";
import Message from "../models/Message";
import User from "../models/User";

export const getMessages = async (req:any, res:any) => {
    try{
        const { userId } = req.params;
        const currentUserId = req.user.id;
        console.log("user id: ", req.user)

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort('timestamp').populate('sender receiver', 'username');

        res.json(messages);
    } catch(err:any){
        res.status(500).json({message: err.message});
    }
}

export const getMyMessages = async (req: any, res: any) => {
  try {
    const chats = await Message.find()
      .populate("sender", "username")
      .populate("receiver", "username");

    if (chats.length === 0) {
      return res.status(404).json({ status: "failed", message: "No chats found" });
    }

    return res.status(200).json(chats);
  } catch (err: any) {
    console.log("Failed to get chats: ", err);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};


export const sendMessage = async (req:any, res:any) => {
    const {roomId, content} = req.body;
    const senderId = req.user.id;

    if(!roomId || !content){
        return res.status(400).json({status: "failed", message: "Missing fields"})
    }

    const message = await Message.create({
        chatRoom: roomId,
        sender: senderId,
        content
    });

    await ChatRoom.findByIdAndUpdate(roomId, {lastMessage: message._id});

    const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'username')
    .populate('chatRoom');

    res.json(populatedMessage);
}


export const getUsers = async (req:any, res:any) =>{
    try{
        const users = await User.find({_id: {$ne: req.user._id}}).select('-password');
        res.json(users);
    } catch(err:any){
        res.status(500).json({message: err.message});
    }
}