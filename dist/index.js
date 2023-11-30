"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const xss_1 = __importDefault(require("./middleware/xss"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(xss_1.default);
app.use(express_1.default.json());
app.use('/api/v1/users', require('./routes/UserRoutes'));
app.get('/test', rateLimiter_1.RateLimiter, (req, res) => {
    console.log('test');
    res.json({ msg: 'test' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
