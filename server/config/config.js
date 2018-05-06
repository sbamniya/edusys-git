var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const env = 'staging';
var host  = 'mongodb://heroku_756c5xzq:bamniya143@ds115340.mlab.com:15340/heroku_756c5xzq'
var dbuser = 'heroku_756c5xzq';
var dbpass = 'bamniya143';
if (env=='dev') {
    host = 'mongodb://localhost:27017/edu-monit-dev';
    dbuser = 'root';
    dbpass = '';
}
const db = {
    host: host,
    user: dbuser,
    password: dbpass
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