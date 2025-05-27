import User from "../models/User";

export const getUsers = async (req:any, res:any) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch (err:any) {
        res.status(500).json({message: "Server Error"}, err)
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
        res.status(500).json({message: "Server Errro"}, err)
    }
}