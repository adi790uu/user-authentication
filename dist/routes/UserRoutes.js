"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
router.route('/register').post(users_1.registerUser);
router.route('/login').post(users_1.authUser);
router.use(rateLimiter_1.RateLimiter);
router.route('/getUser').get(isAuth_1.default, users_1.getLoggedUserDetails);
module.exports = router;
