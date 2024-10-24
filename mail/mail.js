import nodemailer from 'nodemailer';

var transporter;
var userEmail;

export function authMail(service, user, password) {
    transporter = nodemailer.createTransport({
        service: service,
        auth: {
            user: user,
            pass: password,
        }
    });
    userEmail = user;
}

export { transporter, userEmail };
