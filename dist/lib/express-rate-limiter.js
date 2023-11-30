"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
//@ts-ignore
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    message: 'You have exceeded the 100 requests in 24 hrs limit!',
    standardHeaders: true,
    legacyHeaders: false,
});
