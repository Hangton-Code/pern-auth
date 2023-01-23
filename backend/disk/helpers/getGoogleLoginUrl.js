"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
};
const qs = new URLSearchParams(options);
const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
const googleLoginUrl = `${rootUrl}?${qs.toString()}`;
exports.default = googleLoginUrl;
