const NodeMailer = require('nodemailer');

class Mail{

    constructor(){
        this.service = process.env.service;
        this.host = process.env.host;
        this.port = process.env.port;
        this.secure = process.env.secure;
        this.auth = {
            user: process.env.user,
            pass: process.env.pass
        }
    }

    MailConn = NodeMailer.createTransport({
        service: this.service,
        host: this.host,
        port: this.port,
        secure: this.secure,
        auth: {
            user: this.auth.user,
            pass: this.auth.pass
        }
    });

    mailOption = (data) => {

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

    sendmail = async (data) => {
        MailConn.sendMail(this.mailOption(data), (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return error;
            } else {
                console.log('Email sent:', info.response);
                return info.response;
            }
        });
    }

}

module.exports = new Mail;