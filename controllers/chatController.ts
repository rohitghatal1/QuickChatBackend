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


export const getUsers = async (req:any, res:any) =>{
    try{
        const users = await User.find({_id: {$ne: req.user._id}}).select('-password');
        res.json(users);
    } catch(err:any){
        res.status(500).json({message: err.message});
    }
}