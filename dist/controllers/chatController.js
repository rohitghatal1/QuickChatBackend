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
exports.getUsers = exports.getMessages = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const currentUserId = req.user._id;
        const message = yield Message_1.default.find({
            $or: [
                { sender: currentUserId, receiver: user_id },
                { sender: user_id, receiver: currentUserId },
            ],
        }).sort('timestamp');
        res.json(message);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getMessages = getMessages;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({ _id: { $ne: req.user._id } }).select('-password');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getUsers = getUsers;
