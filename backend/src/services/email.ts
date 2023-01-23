import sgMail from "@sendgrid/mail";
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

function sendSignUpEmail(email: string, redirect_url: string) {
  const message = {
    to: email,
    from: process.env.SENDGRID_API_EMAIL as string,
    subject: "Welcome to Code-Hangton!",
    text: "Thank You For Signing Up",
    html: `<h1>Hello User, welcome to Code-Hangton. <a href="${redirect_url}">Click here</a> to continue the registration.</h1>`,
  };

  return sgMail.send(message);
}

function sendSetPasswordEmail(email: string, redirect_url: string) {
  const message = {
    to: email,
    from: process.env.SENDGRID_API_EMAIL as string,
    subject: "Reset Your Password Here!",
    text: "Thank You For Coming Back",
    html: `<h1>Hello User, welcome back to Code-Hangton. <a href="${redirect_url}">Click here</a> to reset your password.</h1>`,
  };

  return sgMail.send(message);
}

export { sendSignUpEmail, sendSetPasswordEmail };
