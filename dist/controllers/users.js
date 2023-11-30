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
exports.getLoggedUserDetails = exports.authUser = exports.registerUser = void 0;
const UserService_1 = __importDefault(require("../services/UserService"));
const user_1 = require("../lib/zod/user");
const zod_1 = require("zod");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = user_1.createUserPayloadSchema.parse(req.body);
        const data = yield UserService_1.default.createUser(payload);
        if (data) {
            return res.status(201).json({ success: true, data: data });
        }
    }
    catch (error) {
        if (error.message === 'User already exists' || 'Username already in use!') {
            return res.status(409).json({ success: false, msg: error.message });
        }
        else if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ success: false, msg: 'Invalid input data' });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: 'Internal Server Error' });
        }
    }
});
exports.registerUser = registerUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = user_1.loginUserPayloadSchema.parse(req.body);
        const data = yield UserService_1.default.loginUser(payload);
        if (data) {
            return res
                .status(200)
                .json({ success: true, msg: 'User logged in', data: data });
        }
    }
    catch (error) {
        if (error.message === 'user not found') {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        else if (error instanceof zod_1.ZodError) {
            return res
                .status(400)
                .json({ success: false, msg: 'Invalid credentials' });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: 'Internal Server Error' });
        }
    }
});
exports.authUser = authUser;
const getLoggedUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.user;
    try {
        const user = yield UserService_1.default.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = {
            username: user.username,
            email: user.email,
        };
        res.status(200).json({ msg: 'Success', data: data });
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getLoggedUserDetails = getLoggedUserDetails;
