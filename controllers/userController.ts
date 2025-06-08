import User from "../models/User";
import bcrypt from "bcryptjs"

export const getUsers = async (req:any, res:any) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch (err:any) {
        res.status(500).json({ statsus:"failed", message: "Server Error"}, err)
    }
}

export const getUserById = async (req:any, res:any) => {
    const userId = req.params.id

    try{
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);

    } catch(err:any){
        res.status(500).json({status:"failed", message: "Server Error"}, err)
    }
}

export const changePassword = async (req:any, res:any) => {
    try{
        const {currentPassword, newPassword} = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({status: 'failed', message: 'User not found'});
            
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch){
            return res.status(400).json({status: 'failed', message: 'Current password is incorrect'}) 
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({status: "success", message: 'Password changed successfully'})

    } catch(err:any){
        res.status(500).json({status: "failed", message: "Server Error"})
    }
}

export const uppdateProfile = async(req:any, res:any) => {
    try{

    } catch(err:any){
        res.status(500).json({status: "failed", message: "Server Error"})
    }
}