import Message from "../../models/Message"

export const getMessages = async (req:any, res:any) => {
    try{
        const messages = await Message.find();

        if(!messages){
            return res.status(404).json({status: "failed", message: "No messages found"})
        }

        return res.status(200).json(messages);
    } catch (err:any){
        res.status(500).json({status: "Failed", message: "Serve error"})
    }
}