const NodeMailer = require('nodemailer');

class Mail{

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