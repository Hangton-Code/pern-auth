"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
const tansporter = nodemailer_1.default.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.NODEMAILER_OUTLOOK_EMAIL,
        pass: process.env.NODEMAILER_OUTLOOK_PASSWORD,
    },
});
exports.default = tansporter;
