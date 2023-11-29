"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const router = express_1.default.Router();
// const validateToken = require('../middleware/validateToken');
// const { registerUser, authUser, getUser } = require('../controllers/users');
router.route('/register').post(users_1.registerUser);
router.route('/login').post(users_1.authUser);
module.exports = router;
