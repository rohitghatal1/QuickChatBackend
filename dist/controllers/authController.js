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
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request: ", req);
    try {
        const { name, number, username, email, password } = req.body;
        const userExists = yield User_1.default.findOne({ number });
        if (userExists)
            return res.status(400).json({ status: "Failed", message: "This number already used" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({ name, number, username, email, password: hashedPassword });
        res.status(201).json({
            _id: user.id,
            name: user.name,
            number: user.number,
            username: user.username,
            email: user.email,
            token: (0, jwt_1.generateToken)(user.id),
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ number });
        if (!user)
            return res.status(400).json({ status: "Failed", message: "User not found" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ status: "Failed", message: "Wrong password" });
        res.json({
            "status": "Success",
            "message": "Logged in successfully",
            token: yield (0, jwt_1.generateToken)(user.id),
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginUser = loginUser;
