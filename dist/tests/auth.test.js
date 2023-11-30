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
// api.test.ts
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const generateUniqueUsername = () => `testuser_${Date.now()}`;
const generateUniqueEmail = () => `adi7990+${Date.now()}@gmail.com`;
const testUser = {
    username: generateUniqueUsername(),
    email: generateUniqueEmail(),
    password: 'StrongPassword123',
};
const invalidUser = {
    username: 'randommly',
    email: 'random',
    password: 'random',
};
const attack = {
    username: "<script>alert('XSS');</script>",
    email: 'testuser@example.com',
    password: 'StrongPassword123',
};
describe('Registration Endpoint Tests', () => {
    test('POST /api/v1/users/register should return status 201', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post('/api/v1/users/register').send({
            username: testUser.username,
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.status).toBe(201);
    }));
    test('POST /api/v1/users/register should return status 409 for existing username', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post('/api/v1/users/register').send({
            username: testUser.username,
            email: generateUniqueEmail(),
            password: testUser.password,
        });
        expect(response.status).toBe(409);
    }));
    test('POST /api/v1/users/register should return status 409 for existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post('/api/v1/users/register').send({
            username: testUser.username,
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.status).toBe(409);
    }));
    test('POST /api/v1/users/register should sanitize input to prevent XSS', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/api/v1/users/register')
            .send(attack);
        expect(response.status).not.toBe(409);
    }));
});
describe('Authentication Endpoint Tests', () => {
    test('POST /api/v1/users/login should return status 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post('/api/v1/users/login').send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.status).toBe(200);
    }));
    test('POST /api/v1/users/login should return status 404 for non-existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post('/api/v1/users/login').send({
            email: generateUniqueEmail(), // Change to a non-existing email
            password: testUser.password,
        });
        expect(response.status).toBe(404);
    }));
    test('POST /api/v1/users/login should return status 400 for invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post('/api/v1/users/login').send({
            email: invalidUser.email,
            password: invalidUser.password,
        });
        expect(response.status).toBe(400);
    }));
});
