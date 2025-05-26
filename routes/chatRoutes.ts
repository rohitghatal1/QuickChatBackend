import express from "express";
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/user', chatController.getUsers);
router.get('/messages/:userId', chatController.getMessages);

export default router;