import Message from "../models/Message";

module.exports = (io:any) => {
 io.on('connection', (socket:any) => {
    console.log('New client connected');

    socket.on('joinCoversation', ({userId} : {userId:any}) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('sendMessage', async ({senderId, receiverId, content}: {senderId: any, receiverId:any, content:any}) => {
        try{
            const message = await Message.create({
                sesnder: senderId,
                receiver: receiverId,
                content
            });

            const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username')
            .populate('receiver', 'username');

            io.to(receiverId).emit('receiverMesssage', populatedMessage);
            io.to(senderId).emit('receiverMessage', populatedMessage);
        } catch(err:any){
            console.error("Error sending message: ", err)
        }
    });

    socket.on('disconnect'), () => {
        console.log('Client disconnected')
    }
 })
}