"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const xss_1 = __importDefault(require("./middleware/xss"));
// import { RateLimiter } from './middleware/redisRateLimiter'
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(xss_1.default);
exports.app.use(express_1.default.json());
exports.app.get('/', (req, res) => {
    res.json({ msg: 'Server working' });
});
exports.app.use('/api/v1/users', require('./routes/UserRoutes'));
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    exports.app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}
