"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserPayloadSchema = exports.createUserPayloadSchema = void 0;
const zod_1 = require("zod");
exports.createUserPayloadSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.loginUserPayloadSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
