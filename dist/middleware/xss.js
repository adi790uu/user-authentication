"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xss_1 = require("xss");
const xssFilter = new xss_1.FilterXSS({});
const sanitizeRequestBody = (req, res, next) => {
    console.log('inside xss middleware');
    if (req.body) {
        Object.keys(req.body).forEach((key) => {
            req.body[key] = xssFilter.process(req.body[key]);
        });
    }
    next();
};
exports.default = sanitizeRequestBody;
