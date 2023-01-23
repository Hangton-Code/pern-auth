"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.use = exports.APIError = void 0;
class APIError extends Error {
    constructor(message, option) {
        super(message);
        this.statusCode = (option === null || option === void 0 ? void 0 : option.statusCode) || 500;
        this.body = option === null || option === void 0 ? void 0 : option.body;
    }
}
exports.APIError = APIError;
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.use = use;
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: true,
        message: `${statusCode === 500 ? "[Server Error] " : ""}${err.message}`,
        body: err.body,
    });
}
exports.errorHandler = errorHandler;
