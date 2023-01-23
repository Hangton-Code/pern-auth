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
exports.getGoogleUser = void 0;
const axios_1 = __importDefault(require("axios"));
function getGoogleAccessToken(code) {
    const options = {
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
        grant_type: "authorization_code",
    };
    const qs = new URLSearchParams(options).toString();
    return (0, axios_1.default)({
        url: `https://oauth2.googleapis.com/token?${qs}`,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then((res) => res.data);
}
function getGoogleUser(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id_token, access_token } = yield getGoogleAccessToken(code);
        const googleUser = (yield (0, axios_1.default)({
            url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        }).then((res) => res.data));
        return googleUser;
    });
}
exports.getGoogleUser = getGoogleUser;
