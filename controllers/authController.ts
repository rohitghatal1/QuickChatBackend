import bcrypt from "bcryptjs";
import User from "../models/User";
import {generateToken} from "../utils/jwt"


export const registerUser = async (req:any, res:any) => {
    try{
        const {name, number, username, email, password} = req.body;

        const userExists = await User.findOne({number});
        if(userExists) return res.status(400).json({status: "Failed", message: "This number already used"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, number, username, email, password: hashedPassword});

        res.status(201).json({
            _id: user.id,
            name: user.name,
            number: user.number,
            username: user.username,
            email: user.email,
            token: generateToken(user.id),
        })
    } catch(err:any){
        res.status(500).json({message: "Server error"})
    }
};

export const loginUser = async (req:any, res:any) => {

    const {number, password} = req.body;
    try{
        const user = await User.findOne({number});
        if(!user) return res.status(400).json({status: "Failed", message: "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({status: "Failed", message: "Wrong password"});

        res.json({
            "status": "Success",
            "message": "Logged in successfully",
            token: await generateToken(user.id),
        })
    } catch(err:any){
        res.status(500).json({message: "Server error"});
    }
}