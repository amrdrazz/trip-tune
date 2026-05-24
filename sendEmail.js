require('dotenv').config();

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);


async function sendEmail (to,code){
    const { data, error } = await resend.emails.send({
    from: 'Trip Tune <onboarding@resend.dev>',
    to: to,
    subject: 'Verification Code',
    html: `<strong>Your verification code is: ${code}</strong>`
    });

    if (error) {
    return console.log(error);
    }

    console.log(data);

}

module.exports = sendEmail;