import errorHandler from "./utils/errorHandler";

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";

const app = express();
const server = http.createServer(app)

//middleware
app.use(cors());
app.use(express.json());

import connectDB from "./config/database";
connectDB();

//Routes
app.get("/", (req:any, res:any) => {
  res.send("QuickChat backend is running!");
});
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCh", "DELETE"]
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})

app.use(errorHandler)
