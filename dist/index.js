"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const express = require('express');
const mongoose = require('mongoose');
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = express();
const server = http.createServer(app);
//middleware
app.use(cors());
app.use(express.json());
const database_1 = __importDefault(require("./config/database"));
(0, database_1.default)();
//Routes
app.get("/", (req, res) => {
    res.send("QuickChat backend is running!");
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/users/', userRoutes_1.default);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCh", "DELETE"]
    }
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
app.use(errorHandler_1.default);
