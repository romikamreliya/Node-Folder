const NodeMailer = require('nodemailer');

class mailService{

    constructor(){
        this.auth = {
            user: process.env.user,
            pass: process.env.pass
        }
    }

    MailConn = NodeMailer.createTransport({
        service: process.env.service,
        host: process.env.host,
        port: process.env.port,
        secure: process.env.secure,
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
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
            replyTo: data.replyTo
        };

    }

    async sendmail(data) {
        try {
            const info = await this.MailConn.sendMail(this.mailOption(data));
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

}

module.exports = new mailService();