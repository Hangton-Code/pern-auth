"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
function signToken(payload, secret_key, options = {}) {
    return jsonwebtoken_1.default.sign(payload, secret_key, options);
}
exports.signToken = signToken;
function verifyToken(token, secret_key) {
    try {
        return jsonwebtoken_1.default.verify(token, secret_key);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new errorHandler_1.APIError(`Invalid Token: ${err.message}`, {
                statusCode: 400,
            });
        }
        throw new errorHandler_1.APIError("JsonWebToken Module Error");
    }
}
exports.verifyToken = verifyToken;
