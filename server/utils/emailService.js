const nodemailer = require('nodemailer');
const asyncHandler=require("express-async-handler");

// Email configuration setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Send password reset email
const sendPasswordResetEmail = asyncHandler( async (to, resetUrl) => {
    const mailOptions = {
        from: `<${process.env.SMTP_HOST}>`, // sender address
        to: to, // list of receivers
        subject: "Password Reset Request", // Subject line
        html: `Please click on the following link to reset your password: <a href="${resetUrl}">Reset Password</a>` // html body
    };

    await transporter.sendMail(mailOptions);
});

module.exports = {
    sendPasswordResetEmail
};
