import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel";

export const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: "failed", message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.Admin_JWT_SECRET) {
      throw new Error("No secret key provided in env");
    }

    const decoded = jwt.verify(token, process.env.Admin_JWT_SECRET!) as {
      id: string;
      _id: string;
    };

    const admin = await AdminModel.findById(decoded.id || decoded._id);

    if (!admin) {
      return res
        .status(404)
        .json({ status: "failed", message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (err: any) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ status: "failed", message: "Invalid token" });
  }
};
