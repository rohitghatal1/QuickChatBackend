require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app)

//middleware
app.use(cors());
app.use(express.json());

const db = require("./config/database");
db.connect();

//Routes

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