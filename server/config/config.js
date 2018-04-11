var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const db = {
    host: 'mongodb://localhost:27017/edu-monit-dev',
    user: 'root',
    password: ''
}
const user = 'sbamniya23@gmail.com';
const pass = 'Bamniya143';
const transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: user,
        pass: pass
    }
}));

module.exports = {
    db: db,
    mail: transporter,
    mailConfig: {
        user: user,
        pass: pass,
        name: 'Sonu Bamniya'
    }
}