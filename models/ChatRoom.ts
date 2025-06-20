import mongoose, {Schema, Document} from "mongoose";

interface IChatRoom extends Document {
    name?: string;
    isGroup: boolean;
    participants: mongoose.Types.ObjectId[];
    admin?: mongoose.Types.ObjectId;
    lastMessage?: mongoose.Types.ObjectId;
}

const ChatRoomSchema = new Schema<IChatRoom>(
    {
        name: {type: String},
        isGroup: {type: Boolean, default: false},
        participants: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
        admin: {type: Schema.Types.ObjectId, ref: 'User'},
        lastMessage: {type: Schema.Types.ObjectId, ref: 'Message'},
    },
    {timestamps: true}
);

export default mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);