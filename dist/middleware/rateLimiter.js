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
exports.RateLimiter = void 0;
const moment_1 = __importDefault(require("moment"));
const ioredis_1 = require("ioredis");
let redisClient = null;
if (process.env.NODE_ENV !== 'test') {
    redisClient = new ioredis_1.Redis();
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
}
const WINDOW_SIZE_IN_HOURS = 1;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;
const MAX_WINDOW_REQUEST_COUNT = 5;
const getCurrentTimestampInSeconds = () => (0, moment_1.default)().unix();
const getRequestLog = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    if (!redisClient) {
        console.error('Redis client does not exist!');
        return null;
    }
    const record = yield redisClient.get(ip);
    return record ? JSON.parse(record) : null;
});
const setRequestLog = (ip, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!redisClient) {
        console.error('Redis client does not exist!');
        return;
    }
    yield redisClient.set(ip, JSON.stringify(data));
});
const RateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!redisClient) {
            console.error('Redis client does not exist!');
            return next();
        }
        const ip = req.ip;
        const data = yield getRequestLog(ip);
        console.log(data);
        if (!data) {
            const newRecord = [
                { requestTimeStamp: getCurrentTimestampInSeconds(), requestCount: 1 },
            ];
            yield setRequestLog(ip, newRecord);
            return next();
        }
        const currentRequestTime = (0, moment_1.default)();
        const windowStartTimestamp = (0, moment_1.default)()
            .subtract(WINDOW_SIZE_IN_HOURS, 'hours')
            .unix();
        const requestsWithinWindow = data.filter((entry) => entry.requestTimeStamp > windowStartTimestamp);
        const totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => accumulator + entry.requestCount, 0);
        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
            return res.status(429).send({
                error: `Too many requests!`,
            });
        }
        const lastRequestLog = data[data.length - 1];
        const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
            .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours')
            .unix();
        if (lastRequestLog.requestTimeStamp >
            potentialCurrentWindowIntervalStartTimeStamp) {
            lastRequestLog.requestCount++;
            data[data.length - 1] = lastRequestLog;
        }
        else {
            data.push({
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1,
            });
        }
        yield setRequestLog(ip, data);
        next();
    }
    catch (error) {
        console.error('Rate Limiter Error', error);
        next();
    }
});
exports.RateLimiter = RateLimiter;
exports.default = redisClient;
