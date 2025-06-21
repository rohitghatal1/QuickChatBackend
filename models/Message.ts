import mongoose, { Document, mongo, Schema } from "mongoose";
import { encrypt, decrypt } from "../utils/encryption";
import { ref } from "process";

interface IMessage extends Document {
  chatRoom: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content?: string;
  readBy: mongoose.Types.ObjectId[];
}

const MessageSchema = new Schema<IMessage>(
  {
    chatRoom: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
