import User from "../../models/User";

export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();

    if (!users) {
      return res
        .status(404)
        .json({ status: "failed", message: "No users found" });
    }

    res.staus(200).json(users);
  } catch (err) {
    console.log("Error fetching users: ", err);
    res.status(500).json({ status: "failed", message: "Server error!" });
  }
};

export const deleteUser = async (req: any, res: any) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "failed", message: "User Id required" });
    }

    User.findByIdAndDelete(userId);

    res.json({
      status: "success",
      message: "user deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ status: "failed", message: "Server error!" });
  }
};
