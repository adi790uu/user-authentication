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
exports.getUser = exports.authUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hash = yield bcrypt_1.default.hash(password, salt);
    const user = yield User.findOne({ username });
    if (user) {
        return res.json({ msg: 'User already exists' });
    }
    const newUser = yield User.create({ username, password: hash });
    const payload = {
        id: newUser._id,
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: '24h' });
    if (newUser) {
        return res.json({ msg: 'User Created', token: token });
    }
    return res.json({ msg: 'Some error occured' });
});
exports.registerUser = registerUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User.findOne({ username });
    if (user) {
        const payload = {
            id: user._id,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: '24h' });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            return res.json({ msg: 'User logged in', token: token });
        }
        return res.json({ msg: 'Invalid credentials' });
    }
    res.json({ msg: 'User not found' });
});
exports.authUser = authUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const keyword = req.query.keyword;
    let user;
    if (keyword) {
        user = yield User.findById(keyword)
            .populate('likes')
            .populate('favorites')
            .populate('postsCreated');
    }
    else {
        user = yield User.findById(userId)
            .populate('likes')
            .populate('favorites')
            .populate('postsCreated');
    }
    if (user) {
        return res.json({ msg: 'Success', user: user });
    }
    res.json({ msg: 'Failed' });
});
exports.getUser = getUser;
