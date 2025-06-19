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

export const getMyMessages = async (req:any, res:any) => {
    try{
        const chats = await Message.find();
        if(!chats){
            res.status(404).json({satus: "failed", message: "No chats found"});
        }

        res.status(200).json(chats);
    } catch (err:any){
        console.log("Failed to get chats: ", err)
    }
}

export const sendMessage = async (req:any, res:any) => {
    try{
        const {receiverId, content} = req.body;
        const senderId = req.user.id;

        if(!receiverId || !content){
            return res.status(400).json({message: "Missing required fields"});
        }

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content
        })

        const populatedMessage = await Message.findById(message.id)
        .populate('sender', 'username')
        .populate('receiver', 'username')

        res.json(populatedMessage)

    } catch(err:any){
        console.error("Error sending  message:", err.message);
        res.status(500).json({message: err.message})
    }
}


export const getUsers = async (req:any, res:any) =>{
    try{
        const users = await User.find({_id: {$ne: req.user._id}}).select('-password');
        res.json(users);
    } catch(err:any){
        res.status(500).json({message: err.message});
    }
}