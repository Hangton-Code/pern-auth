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
const errorHandler_1 = require("../helpers/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbUsers_1 = require("../services/dbUsers");
const checkAuth = (0, errorHandler_1.use)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const beareredToken = req.headers["authorization"];
    const access_token = beareredToken ? beareredToken.split(" ")[1] : null;
    if (!access_token)
        throw new errorHandler_1.APIError("Unauthorized", {
            statusCode: 401,
        });
    let id = "";
    // verifiy token and get the id from it
    try {
        id = jsonwebtoken_1.default.verify(access_token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY).id;
    }
    catch (err) {
        if (err instanceof Error)
            throw new errorHandler_1.APIError(`Unauthorized (Invalid Token): ${err.message}`, {
                statusCode: 401,
                body: {
                    invalidToken: true,
                },
            });
    }
    // check if user exist
    const user = yield (0, dbUsers_1.getUserById)(id);
    if (!user)
        throw new errorHandler_1.APIError("Unauthorized (User Does Not Exist)", {
            statusCode: 401,
        });
    req.user = user;
    next();
}));
exports.default = checkAuth;
