import User from "../../models/User";
import { generateToken } from "../../utils/jwt";
import AdminModel from "../models/AdminModel";
import bcrypt from "bcryptjs";

export const adminRegister = async (req:any, res:any) => {
    try{
        const {name, number, email, password} = req.body;

        const adminExists = await AdminModel.findOne({number});

        if(adminExists){
            console.log("Admin already exist");
            return res.status(400).json({status: "failed", message: "This number is already used"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await AdminModel.create({name, number, email, password: hashedPassword});
        
        res.status(201).json({
            staus: "success",
            message: "admin created successfully",
            _id: admin.id,
            name: admin.name,
            number: admin.number,
            token: generateToken(admin.id),
        })
         
    } catch (err:any){
        console.error("error rigistering admin: ", err)
        res.status(400).json({status: "failed", message: "Failed to register admin"})
    }
}

export const adminLogin = async (req:any, res:any) => {
    try{
        const {number, password} = req.body;

        const admin = await AdminModel.findOne({number});

        if(!admin){
            return res.status(404).json({status: "failed", message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if(!isMatch){
            return res.status(400).json({status: "failed", message: "Wrong password! please try again"})
        }

        res.json({
            _id: admin.id,
            name: admin.name,
            token: generateToken(admin.id)
        })

    } catch(err){
        console.log("Failed to login : ", err);
        res.status(400).json({status: "failed", message: "Failed to login"})
    }
}