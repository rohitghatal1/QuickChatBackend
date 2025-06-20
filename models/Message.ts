import mongoose, {Document, Schema} from "mongoose";
import {encrypt, decrypt} from '../utils/encryption';

interface IMessage extends Document{
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content?: string;
    encryptedContent: string;
    timestamp: Date;
    read: boolean;
}

const MessageSchema: Schema = new Schema ({
    sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    receiver: {type: Schema.Types.ObjectId, ref:'User', required: true},
    content: { type: String, required: true},
    // encryptedContent: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    read: {type: Boolean, default: false}
});

// MessageSchema.pre<IMessage>('save', function (next) {
//   console.log('Pre-save hook triggered, content:', this.content);
//   if (this.isModified('content') && this.content) {
//     this.encryptedContent = encrypt(this.content);
//     this.content = undefined;
//   }
//   next();
// });

MessageSchema.post<IMessage>('find', function(docs:any){
    docs.forEach((doc:any) => {
        if(doc.encryptedContent){
            doc.content = decrypt(doc.content)
        }
    });
});

export default mongoose.model<IMessage>('Message', MessageSchema)