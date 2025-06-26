import express from "express";
import { deleteUser, getAllUsers } from "../controllers/userController";

const router = express.Router();

router.get("/getUsers", getAllUsers);
router.delete("/deleteUser/:userId", deleteUser);
