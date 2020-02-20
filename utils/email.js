const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user) {
    this.from = `Andrea Arseni <${process.env.EMAIL}>`;
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
  }

  createNewConstructor() {
    if (process.env.NODE_ENV === `development`) {
      return nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "651fb83ecc9777",
          pass: "4c5cece17ba42b"
        }
      });
    }
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 25,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_PASSWORD
      }
    });
  }

  async sendEmail(type, subject, url) {
    const transport = this.createNewConstructor();
    const html = pug.renderFile(`${__dirname}/../views/email/${type}.pug`, {
      subject,
      url,
      firstName: this.firstName
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };
    await transport.sendMail(mailOptions);
  }

  async sendWelcomeEmail() {
    await this.sendEmail(
      `welcome`,
      `Benvennniuùùùùto`,
      `https://127.0.0.1:8000/me`
    );
  }

  async sendResetPswEmail(url) {
    await this.sendEmail(
      `resetPsw`,
      `Your reset Psw token (valid for 10 minutes)`,
      url
    );
  }
};
