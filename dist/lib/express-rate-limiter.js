"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
//@ts-ignore
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const customRateLimitHandler = (req, res) => {
    return res.status(429).json({
        status: 'error',
        message: 'You have exceeded the rate limit for this endpoint.',
        data: null,
    });
};
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
    handler: customRateLimitHandler,
    standardHeaders: true,
    legacyHeaders: false,
});
