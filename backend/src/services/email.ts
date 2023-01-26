import tansporter from "../nodemailer";

function sendSignUpEmail(email: string, redirect_url: string) {
  const message = {
    from: process.env.NODEMAILER_OUTLOOK_EMAIL as string,
    to: email,
    subject: "Welcome to Code-Hangton!",
    text: `Thank you for signing up. Link to continue the registration: ${redirect_url}`,
    html: `<h1>Hello User, welcome to PERN-AUTH. <a href="${redirect_url}">Click here</a> to continue the registration.</h1>`,
  };

  return tansporter.sendMail(message);
}

function sendSetPasswordEmail(email: string, redirect_url: string) {
  const message = {
    from: process.env.NODEMAILER_OUTLOOK_EMAIL as string,
    to: email,
    subject: "Set Your New Password Here!",
    text: `Thank you for using PERN-AUTH. Link to set up your new password: ${redirect_url}`,
    html: `<h1>Hello User, welcome back to PERN-AUTH. <a href="${redirect_url}">Click here</a> to reset your password.</h1>`,
  };

  return tansporter.sendMail(message);
}

export { sendSignUpEmail, sendSetPasswordEmail };
