import bcrypt from "bcryptjs";
import User from "../models/User";
import {generateToken} from "../utils/jwt"


export const registerUser = async (req: any, res: any) => {
    console.log("➡️ Register request received:", req.body);

    try {
        const { name, number, username, email, password } = req.body;

        const userExists = await User.findOne({ number });
        if (userExists) {
            console.log("❌ User already exists with number:", number);
            return res.status(400).json({ status: "Failed", message: "This number already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, number, username, email, password: hashedPassword });

        console.log("✅ New user registered:", user);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            number: user.number,
            username: user.username,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (err: any) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


export const loginUser = async (req: any, res: any) => {
    console.log("➡️ Login request received:", req.body);

    const { number, password } = req.body;

    try {
        const user = await User.findOne({ number });
        if (!user) {
            console.log("❌ User not found for number:", number);
            return res.status(400).json({ status: "Failed", message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password for number:", number);
            return res.status(400).json({ status: "Failed", message: "Wrong password" });
        }

        console.log("✅ Login successful for user:", user.username);

        res.json({
            status: "Success",
            message: "Logged in successfully",
            token: generateToken(user.id),
        });
    } catch (err: any) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
