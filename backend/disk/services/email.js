"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSetPasswordEmail = exports.sendSignUpEmail = void 0;
const nodemailer_1 = __importDefault(require("../nodemailer"));
function sendSignUpEmail(email, redirect_url) {
    const message = {
        from: process.env.NODEMAILER_OUTLOOK_EMAIL,
        to: email,
        subject: "Welcome to Code-Hangton!",
        text: `Thank you for signing up. Link to continue the registration: ${redirect_url}`,
        html: `<h1>Hello User, welcome to PERN-AUTH. <a href="${redirect_url}">Click here</a> to continue the registration.</h1>`,
    };
    return nodemailer_1.default.sendMail(message);
}
exports.sendSignUpEmail = sendSignUpEmail;
function sendSetPasswordEmail(email, redirect_url) {
    const message = {
        from: process.env.NODEMAILER_OUTLOOK_EMAIL,
        to: email,
        subject: "Set Your New Password Here!",
        text: `Thank you for using PERN-AUTH. Link to set up your new password: ${redirect_url}`,
        html: `<h1>Hello User, welcome back to PERN-AUTH. <a href="${redirect_url}">Click here</a> to reset your password.</h1>`,
    };
    return nodemailer_1.default.sendMail(message);
}
exports.sendSetPasswordEmail = sendSetPasswordEmail;
