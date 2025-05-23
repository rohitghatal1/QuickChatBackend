import mongoose, {Document, Schema} from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        content: {type: String, required: true},
        timestamp: {type: Date, default: Date.now},
        read: {type: Boolean, default: false},
    }
);

export default mongoose.model("Message", messageSchema);