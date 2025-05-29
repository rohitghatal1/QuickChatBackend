import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const protect = async (req:any, res:any, next:NextFunction) => {
    try{
        const token = req.headers.authorization?.split("")[1];
        if(!token) return res.status(401).json({message: "Autorization failed"});

        const decode: any = jwt.verify(token, process.env.JWT_SECRET as String);
        req.user = await User.findById(decode.id).select("-password");

        if(!req.user) return res.status(401).json({message: "User not found"});

        next();
    } catch(err:any){
        res.status(401).json({message: "Invalid token"})
    }
}