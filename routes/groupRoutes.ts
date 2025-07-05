import express from "express";
import { createGroup } from "../controllers/groupController";

const router = express.Router();

router.post("/createGroup", createGroup);

export default router;
