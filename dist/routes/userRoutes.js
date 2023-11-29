"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
exports.router = express_1.default.Router();
// const validateToken = require('../middleware/validateToken');
// const { registerUser, authUser, getUser } = require('../controllers/users');
exports.router.route('/register').post(users_1.registerUser);
exports.router.route('/login').post(users_1.authUser);
