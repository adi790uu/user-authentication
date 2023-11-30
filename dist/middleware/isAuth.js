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
const UserService_1 = __importDefault(require("../services/UserService"));
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = header.split(' ')[1];
        const { id } = UserService_1.default.decodeJWTToken(token);
        //@ts-ignore
        req.user = id;
        next();
    }
    catch (error) {
        console.error('Token validation error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.default = validateToken;
