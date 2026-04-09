const NodeMailer = require("nodemailer");

class MailService {
  constructor() {
    this.auth = {
      user: process.env.MAIL_USER || process.env.user,
      pass: process.env.MAIL_PASS || process.env.pass,
    };
  }

  MailConn = NodeMailer.createTransport({
    service: process.env.MAIL_SERVICE || process.env.service,
    host: process.env.MAIL_HOST || process.env.host,
    port: process.env.MAIL_PORT || process.env.port,
    secure: process.env.MAIL_SECURE || process.env.secure,
    auth: {
      user: process.env.MAIL_USER || process.env.user,
      pass: process.env.MAIL_PASS || process.env.pass,
    },
  });

  mailOption(data) {
    return {
      from: data.from ?? this.auth.user,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
      cc: data.cc,
      bcc: data.bcc,
      attachments: data.attachments,
      replyTo: data.replyTo,
    };
  }

  async sendmail(data) {
    try {
      const info = await this.MailConn.sendMail(this.mailOption(data));
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

module.exports = new MailService();
