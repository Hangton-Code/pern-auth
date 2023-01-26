import nodemailer from "nodemailer";
require("dotenv").config();

const tansporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.NODEMAILER_OUTLOOK_EMAIL as string,
    pass: process.env.NODEMAILER_OUTLOOK_PASSWORD as string,
  },
});

export default tansporter;
