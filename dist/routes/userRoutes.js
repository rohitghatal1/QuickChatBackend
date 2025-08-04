"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/getUsers", userController_1.getUsers);
router.get("/auth/me", authMiddleware_1.verifyToken, userController_1.getCurrentUser);
router.patch("/changePassword", authMiddleware_1.verifyToken, userController_1.changePassword);
router.patch("/updateProfile", authMiddleware_1.verifyToken, userController_1.updateProfile);
exports.default = router;
