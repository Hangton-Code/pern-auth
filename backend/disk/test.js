"use strict";
const SibApiV3Sdk = require("sib-api-v3-typescript");
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
sendSmtpEmail.subject = "My";
sendSmtpEmail.htmlContent =
    "<html><body><h1>This is my first transactional email </h1></body></html>";
sendSmtpEmail.sender = { name: "John Doe", email: "code.hangton@gmail.com" };
sendSmtpEmail.to = [{ email: "code.hangton@gmail.com", name: "Jane Doe" }];
sendSmtpEmail.cc = [{ email: "code.hangton@gmail.com", name: "Janice Doe" }];
sendSmtpEmail.bcc = [{ name: "John Doe", email: "code.hangton@gmail.com" }];
sendSmtpEmail.replyTo = { email: "code.hangton@gmail.com", name: "John Doe" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { parameter: "My param value", subject: "New Subject" };
apiInstance.sendTransacEmail(sendSmtpEmail).then(() => { });
