import User from "../models/User";
import bcrypt from "bcryptjs"

export const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({
      status: "failed",
      message: "Server Error",
      error: err.message,
    });
  }
};

export const getCurrentUser = async (req:any, res:any) => {
    try{
        const user = req.user;
        res.status(200).json(user);
    } catch(err:any){
        res.status(500).json({status: 'failed', message: 'Failed to fecth user info'});
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
        await User.findOneAndUpdate({_id: userId}, {password: hashedPassword});
        // user.password = hashedPassword;
        // await user.save();

        res.status(200).json({status: "success", message: 'Password changed successfully'})

    } catch(err:any){
        res.status(500).json({status: "failed", message: "Server Error"})
    }
}

export const updateProfile = async(req:any, res:any) => {
    try{
        const userId = req.user.id;
        const {name, email} = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {name, email},
            {new: true, runValidators: true}
        );

        if(!updatedUser){
            return res.status(404).json({status: 'failed', message: 'User nor found'});
        }

        res.status(200).json({status: 'success', message: 'Profile updated successfullly'})

    } catch(err:any){
        res.status(500).json({status: "failed", message: "Server Error"})
    }
}