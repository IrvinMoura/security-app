export function authMail(service, user, password) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: service,
        auth: {
            user: user,
            password: password,
        }
});
userEmail = user;
}
export {transporter, userEmail};
