import User from "../../models/User";

export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();

    if (!users) {
      return res
        .status(404)
        .json({ status: "failed", message: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.log("Error fetching users: ", err);
    res.status(500).json({ status: "failed", message: "Server error!" });
  }
};

export const deleteUser = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "failed", message: "User ID required" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ status: "failed", message: "Server error!" });
  }
};
