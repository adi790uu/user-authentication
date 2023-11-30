"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const xss_1 = __importDefault(require("./middleware/xss"));
const rateLimiter_1 = require("./middleware/rateLimiter");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(xss_1.default);
exports.app.use(express_1.default.json());
exports.app.use('/api/v1/users', require('./routes/UserRoutes'));
exports.app.get('/test', rateLimiter_1.RateLimiter, (req, res) => {
    console.log('test');
    res.json({ msg: 'test' });
});
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    exports.app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}
