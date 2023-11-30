"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
// import { RateLimiter } from '../middleware/redisRateLimiter'
const express_rate_limiter_1 = require("../lib/express-rate-limiter");
const router = express_1.default.Router();
router.route('/register').post(users_1.registerUser);
router.route('/login').post(users_1.authUser);
router.use(express_rate_limiter_1.limiter);
router.route('/getUser').get(isAuth_1.default, users_1.getLoggedUserDetails);
module.exports = router;
