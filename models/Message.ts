import mongoose,{Document, mongo, Schema} from "mongoose";;
import { encrypt, decrypt } from "../utils/encryption";
import { ref } from "process";

interface IMessage extends Document{
    chatRoom: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content?: string;
    encryptedContent: string;
    readBy: mongoose.Types.ObjectId[];
}

const MessageSchema = new Schema<IMessage>(
    {
        chatRoom: {type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true},
        sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        content: {type: String, select: false},
        encryptedContent: {type: String, required: true},
        readBy: [{type: Schema.Types.ObjectId, ref: 'User'}]
    },
    {timestamps: true}
);

MessageSchema.pre<IMessage>('save', function (next){
    if(this.isModified('content') && this.content) {
        this.encryptedContent = encrypt(this.content);
        this.content = undefined;
    }
    next();
});

MessageSchema.post<IMessage>('find', function (docs:any) {
    docs.forEach((doc:any) => {
        if(doc.encryptedContent){
            doc.content = decrypt(doc.encryptedContent);
        }
    })
});

MessageSchema.post<IMessage>('findOne', function (doc:any) {
    if(doc?.encryptedContent){
        doc.content = decrypt(doc.encryptedContent);
    }
})

export default mongoose.model<IMessage>('Message', MessageSchema);