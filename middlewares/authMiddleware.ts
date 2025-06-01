import jwt from "jsonwebtoken";
import User from "../models/User";

export const verifyToken = async (req:any, res:any, next:any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if(!process.env.JWT_SECRET){
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id: string, _id: string}; 

    const user = await User.findById(decoded.id || decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err:any) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
