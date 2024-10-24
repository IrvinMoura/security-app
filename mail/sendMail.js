import {transporter, userEmail} from './mail';

export function sendMail(to, subject, text) {
    var mailOptions = {
        from: userEmail,
        to: to,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
