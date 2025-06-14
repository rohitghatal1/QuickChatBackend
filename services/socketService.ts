import Message from "../models/Message";
import {Server, Socket} from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface UserSocket extends Socket{
    userId?: string;
}

export default (io: Server) => {
    io.on('connection', (socket: UserSocket) => {
        console.log('New client connected');

        socket.on('joinConversation', ({userId}: {userId:string}) => {
            if(!userId){
                console.error('No userId provided');
                return;
            }
            socket.join(userId);
            socket.userId = userId;
            console.log(`User ${userId} joined their room`);
        });

        socket.on('sendMessage', async (data) => {
            try{
                const {token, receiverId, content} = data
                if(!token || !receiverId || !content){
                    throw new Error('Missing required fields');
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {id:string, _id: string};
                const senderId = decoded.id;
                const sender = await User.findById(senderId);        

                if(!sender) throw new Error('Sender not found');

                const message = await Message.create({
                    sender: senderId, 
                    receiver: receiverId,
                    content
                })
                
                const populatedMessage = await Message.findById(message._id).populate('sender', 'username').populate('receiver', 'username');

                if(!populatedMessage){
                    throw new Error('Failed to populated message');
                }

                io.to(receiverId).emit('receiveMessage', populatedMessage);
                io.to(senderId).emit('receiveMessage', populatedMessage);

            } catch(err:any){
                console.error("Error sending message: ", err.message);
                socket.emit('messageError', {
                    error: "Failed to send message",
                    details: err.message
                })
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client ${socket.userId || socket.id} disconnected`);
        });
    });
}