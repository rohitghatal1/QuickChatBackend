import { timeStamp } from "console";
import mongoose, {Document, Schema} from "mongoose";

interface IAdmin extends Document{
    name: string,
    number: string,
    email: string,
    password: string,
}

const AdminSchma = new Schema<IAdmin>({
    name: {type: String, required:true},
    number: {type: String, required:true, unique: true},
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {timestamps: true}
);

export default mongoose.model<IAdmin>("AdminModel", AdminSchma);
