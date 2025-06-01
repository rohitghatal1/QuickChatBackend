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
const Message_1 = __importDefault(require("../models/Message"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
exports.default = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('joinConversation', ({ userId }) => {
            if (!userId) {
                console.error('No userId provided');
                return;
            }
            socket.join(userId);
            socket.userId = userId;
            console.log(`User ${userId} joined their room`);
        });
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { token, receiverId, content } = data;
                if (!token || !receiverId || !content) {
                    throw new Error('Missing required fields');
                }
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const senderId = decoded.id;
                const sender = yield User_1.default.findById(senderId);
                if (!sender)
                    throw new Error('Sender not found');
                const message = yield Message_1.default.create({
                    sender: senderId,
                    receiver: receiverId,
                    content
                });
                const populatedMessage = yield Message_1.default.findById(message._id).populate('sender', 'username').populate('receiver', 'username');
                if (!populatedMessage) {
                    throw new Error('Failed to populated message');
                }
                io.to(receiverId).emit('receiveMessage', populatedMessage);
                io.to(senderId).emit('receiveMessage', populatedMessage);
            }
            catch (err) {
                console.error("Error sending message: ", err.message);
                socket.emit('messageError', {
                    error: "Failed to send message",
                    details: err.message
                });
            }
        }));
        socket.on('disconnect', () => {
            console.log(`Client ${socket.userId || socket.id} disconnected`);
        });
    });
};
