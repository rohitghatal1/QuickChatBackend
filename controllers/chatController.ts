import Message from "../models/Message";
import User from "../models/User";

export const getMessages = async (req:any, res:any) => {
    try{
        const {user_id} = req.params;
        const currentUserId = req.user._id;

        const message = await Message.find({
            $or: [
                {sender: currentUserId, receiver: user_id},
                {sender: user_id, receiver: currentUserId},
            ],
        }).sort('timestamp').populate('sender receiver', 'username');

        res.json(message);
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