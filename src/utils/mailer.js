const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host : "localhost",
    port :1025,
    secure : false,
});

async function sendEmail ({to , subject , text }){
    await transporter.sendMail({
        from : "no-reply@job-platform.dev",
        to,
        subject,
        text,
    });
}


module.exports = {sendEmail};