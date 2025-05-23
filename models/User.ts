import mongoose, {Document, Schema} from "mongoose";

const userSchema = new Schema({
    name: {type: String, required: true},
    number: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}, {timestamps: true})

export default mongoose.model("User", userSchema)