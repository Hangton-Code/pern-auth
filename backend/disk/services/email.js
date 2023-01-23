"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSetPasswordEmail = exports.sendSignUpEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
require("dotenv").config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
function sendSignUpEmail(email, redirect_url) {
    const message = {
        to: email,
        from: process.env.SENDGRID_API_EMAIL,
        subject: "Welcome to Code-Hangton!",
        text: "Thank You For Signing Up",
        html: `<h1>Hello User, welcome to Code-Hangton. <a href="${redirect_url}">Click here</a> to continue the registration.</h1>`,
    };
    return mail_1.default.send(message);
}
exports.sendSignUpEmail = sendSignUpEmail;
function sendSetPasswordEmail(email, redirect_url) {
    const message = {
        to: email,
        from: process.env.SENDGRID_API_EMAIL,
        subject: "Reset Your Password Here!",
        text: "Thank You For Coming Back",
        html: `<h1>Hello User, welcome back to Code-Hangton. <a href="${redirect_url}">Click here</a> to reset your password.</h1>`,
    };
    return mail_1.default.send(message);
}
exports.sendSetPasswordEmail = sendSetPasswordEmail;
