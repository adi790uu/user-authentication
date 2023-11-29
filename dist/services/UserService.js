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
const db_1 = require("../lib/db");
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = 'TRabdom2ejed';
class UserService {
    static generateHash(salt, password) {
        const hashedPassword = (0, node_crypto_1.createHmac)('sha256', salt)
            .update(password)
            .digest('hex');
        return hashedPassword;
    }
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = payload;
            const existingUser = yield UserService.getUserByEmail(email);
            if (existingUser) {
                throw new Error('User already exists');
            }
            const salt = (0, node_crypto_1.randomBytes)(32).toString('hex');
            const hashedPassword = UserService.generateHash(salt, password);
            const newUser = yield db_1.db.user.create({
                data: {
                    email,
                    name,
                    salt,
                    password: hashedPassword,
                },
            });
            if (newUser) {
                const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, SECRET);
                const data = {
                    user: newUser,
                    token: token,
                };
                return data;
            }
        });
    }
    static getUserByEmail(email) {
        return db_1.db.user.findUnique({ where: { email } });
    }
    static loginUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield UserService.getUserByEmail(email);
            if (!user)
                throw new Error('user not found');
            const userSalt = user.salt;
            const usersHashPassword = UserService.generateHash(userSalt, password);
            if (usersHashPassword !== user.password)
                throw new Error('Incorrect Password');
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET);
            const data = {
                user: user,
                token: token,
            };
            return data;
        });
    }
    static decodeJWTToken(token) {
        return jsonwebtoken_1.default.verify(token, SECRET);
    }
}
exports.default = UserService;
