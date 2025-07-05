"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.changePassword = exports.getUserById = exports.getCurrentUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json(users);
    }
    catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({
            status: "failed",
            message: "Server Error",
            error: err.message,
        });
    }
});
exports.getUsers = getUsers;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ status: 'failed', message: 'Failed to fecth user info' });
    }
});
exports.getCurrentUser = getCurrentUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ status: "failed", message: "Server Error" }, err);
    }
});
exports.getUserById = getUserById;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'failed', message: 'User not found' });
        }
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'failed', message: 'Current password is incorrect' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield User_1.default.findOneAndUpdate({ _id: userId }, { password: hashedPassword });
        // user.password = hashedPassword;
        // await user.save();
        res.status(200).json({ status: "success", message: 'Password changed successfully' });
    }
    catch (err) {
        res.status(500).json({ status: "failed", message: "Server Error" });
    }
});
exports.changePassword = changePassword;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ status: 'failed', message: 'User nor found' });
        }
        res.status(200).json({ status: 'success', message: 'Profile updated successfullly' });
    }
    catch (err) {
        res.status(500).json({ status: "failed", message: "Server Error" });
    }
});
exports.updateProfile = updateProfile;
