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
exports.googleRedirect = exports.setPasswordController = exports.setPasswordEmailController = exports.logoutController = exports.refreshTokenController = exports.signupController = exports.signupEmailController = exports.loginController = void 0;
const errorHandler_1 = require("../helpers/errorHandler");
const dbUsers_1 = require("../services/dbUsers");
const email_1 = require("../services/email");
const bcrypt_1 = __importDefault(require("bcrypt"));
const googleLogin_1 = require("../services/googleLogin");
const type_1 = require("../type");
const jwt_1 = require("../helpers/jwt");
function loginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;
        // get user data from db
        const user = yield (0, dbUsers_1.getUserByEmail)(email);
        // if user does not exist
        if (!user)
            throw new errorHandler_1.APIError("User Does Not Exist", {
                statusCode: 400,
            });
        // verify password
        const passwordVerificaionResult = yield bcrypt_1.default.compare(password, user.password); // plain password, hashed password on db
        if (!passwordVerificaionResult)
            throw new errorHandler_1.APIError("Invalid Password", {
                statusCode: 400,
            });
        // generate a refresh token and save it on db
        const refresh_token = (0, jwt_1.signToken)({
            id: user.id,
        }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: "1y",
        });
        const new_refresh_token_list = [...user.refresh_token, refresh_token];
        yield (0, dbUsers_1.editRefreshToken)(new_refresh_token_list, user.id);
        // generate an access token for user to use now
        const access_token = (0, jwt_1.signToken)({
            id: user.id,
        }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: "1h",
        });
        res.json({
            message: "success",
            body: {
                user,
                refresh_token,
                access_token,
            },
        });
    });
}
exports.loginController = loginController;
function signupEmailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        // check if user exists
        yield (0, dbUsers_1.getUserByEmail)(email).then((user) => {
            if (user)
                throw new errorHandler_1.APIError("User Exists", {
                    statusCode: 400,
                });
        });
        const token = (0, jwt_1.signToken)({
            email,
        }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: "8d" });
        const redirect_url = `${process.env.CLIENT_URL}/auth/credentials/signup?token=${token}`;
        console.log(redirect_url);
        yield (0, email_1.sendSignUpEmail)(email, redirect_url);
        res.status(200).json({
            message: "success",
        });
    });
}
exports.signupEmailController = signupEmailController;
function signupController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.body.token;
        const password = req.body.password;
        // verifiy token and get the email from it
        const email = (0, jwt_1.verifyToken)(token, process.env.JWT_TOKEN_SECRET_KEY).email;
        // check if user exists
        yield (0, dbUsers_1.getUserByEmail)(email).then((user) => {
            if (user)
                throw new errorHandler_1.APIError("User Exists", {
                    statusCode: 400,
                });
        });
        const user = yield (0, dbUsers_1.signUp)(email, password);
        // generate a refresh token and save it on db
        const refresh_token = (0, jwt_1.signToken)({
            id: user.id,
        }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: "1y",
        });
        yield (0, dbUsers_1.editRefreshToken)([refresh_token], user.id);
        // generate an access token for user to use now
        const access_token = (0, jwt_1.signToken)({
            id: user.id,
        }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: "1h",
        });
        res.json({
            message: "success",
            body: {
                user,
                refresh_token,
                access_token,
            },
        });
    });
}
exports.signupController = signupController;
function refreshTokenController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refresh_token = req.body.refresh_token;
        // verifiy token and get the id from it
        const id = (0, jwt_1.verifyToken)(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY).id;
        // check if user exist
        const user = yield (0, dbUsers_1.getUserById)(id);
        if (!user)
            throw new errorHandler_1.APIError("User Does Not Exist", {
                statusCode: 400,
            });
        // check if refresh_token still valid (exist in the db)
        if (!user.refresh_token.includes(refresh_token)) {
            throw new errorHandler_1.APIError("Invalid Token", {
                statusCode: 400,
            });
        }
        // generate an access token for user to use now
        const access_token = (0, jwt_1.signToken)({
            id,
        }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: "1h",
        });
        res.json({
            message: "success",
            body: {
                access_token,
            },
        });
    });
}
exports.refreshTokenController = refreshTokenController;
function logoutController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refresh_token = req.body.refresh_token;
        // verifiy token and get the id from it
        const id = (0, jwt_1.verifyToken)(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY).id;
        // check if user exist
        const user = yield (0, dbUsers_1.getUserById)(id);
        if (!user)
            throw new errorHandler_1.APIError("User Does Not Exist", {
                statusCode: 400,
            });
        // remove the refresh token from db
        const new_refresh_token_list = user.refresh_token.filter((value) => value !== refresh_token);
        yield (0, dbUsers_1.editRefreshToken)(new_refresh_token_list, id);
        res.json({
            message: "success",
        });
    });
}
exports.logoutController = logoutController;
function setPasswordEmailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        // check if user exists
        const user = yield (0, dbUsers_1.getUserByEmail)(email);
        if (!user)
            throw new errorHandler_1.APIError("User Does Not Exist", {
                statusCode: 400,
            });
        const token = (0, jwt_1.signToken)({
            id: user.id,
        }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: "8d" });
        const redirect_url = `${process.env.CLIENT_URL}/auth/credentials/set_password?token=${token}`;
        console.log(redirect_url);
        yield (0, email_1.sendSetPasswordEmail)(email, redirect_url);
        res.json({
            message: "success",
        });
    });
}
exports.setPasswordEmailController = setPasswordEmailController;
function setPasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.body.token;
        const requested_password = req.body.password;
        // verifiy token and get the email from it
        const id = (0, jwt_1.verifyToken)(token, process.env.JWT_TOKEN_SECRET_KEY).id;
        const user = yield (0, dbUsers_1.getUserById)(id);
        if (!user)
            throw new errorHandler_1.APIError("User Does Not Exist", {
                statusCode: 400,
            });
        yield (0, dbUsers_1.setPassword)(requested_password, id);
        res.json({
            message: "success",
        });
    });
}
exports.setPasswordController = setPasswordController;
// google
function googleRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = req.query.code;
        const { email, name, picture } = yield (0, googleLogin_1.getGoogleUser)(code);
        let user = yield (0, dbUsers_1.getUserByEmail)(email);
        // if it turns out that user has not been created, create one
        if (!user) {
            user = yield (0, dbUsers_1.signUp)(email, null, type_1.UserProvider.GOOGLE);
            // set google provided user data
            yield (0, dbUsers_1.editProfile)(Object.assign(Object.assign({}, user), { user_name: name, user_avatar_type: type_1.UserAvatarType.URL, user_avatar_content: picture }));
        }
        // generate a refresh token and save it on db
        const refresh_token = (0, jwt_1.signToken)({
            id: user.id,
        }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: "1y",
        });
        const new_refresh_token_list = [...user.refresh_token, refresh_token];
        yield (0, dbUsers_1.editRefreshToken)(new_refresh_token_list, user.id);
        // generate an access token for user to use now
        const access_token = (0, jwt_1.signToken)({
            id: user.id,
        }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: "1h",
        });
        const redirectQuery = {
            user: JSON.stringify(user),
            refresh_token,
            access_token,
        };
        const qs = new URLSearchParams(redirectQuery).toString();
        res.redirect(`${process.env.CLIENT_URL}/auth/google/redirect?${qs}`);
    });
}
exports.googleRedirect = googleRedirect;
