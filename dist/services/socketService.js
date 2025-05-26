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
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('joinCoversation', ({ userId }) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });
        socket.on('sendMessage', (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId, content }) {
            try {
                const message = yield Message_1.default.create({
                    sesnder: senderId,
                    receiver: receiverId,
                    content
                });
                const populatedMessage = yield Message_1.default.findById(message._id)
                    .populate('sender', 'username')
                    .populate('receiver', 'username');
                io.to(receiverId).emit('receiverMesssage', populatedMessage);
                io.to(senderId).emit('receiverMessage', populatedMessage);
            }
            catch (err) {
                console.error("Error sending message: ", err);
            }
        }));
        socket.on('disconnect'), () => {
            console.log('Client disconnected');
        };
    });
};
