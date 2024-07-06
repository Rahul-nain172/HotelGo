import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import User from '../models/users.js'

export const sendEmail = async ({ email, emailType, userId ,orderId}) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        let html,subject;
        if (emailType === 'verifyEmail') {
            await User.findByIdAndUpdate(userId, {
                $set: { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 360000 }
            });
            html = `<p><a href="${process.env.DOMAIN}/verifyEmail/?token=${hashedToken}">Click Here</a>to verify your email or copy paste the link in your browser<br>
            ${process.env.DOMAIN}/verifyEmail/?token=${hashedToken} </p>`;
            subject='Verify your Email';

        }
        else if (emailType === 'forgotPassword') {
            await User.findByIdAndUpdate(userId, {
                $set: { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 360000 }
            });
            html = `<p><a href="${process.env.DOMAIN}/resetPassword/?token=${hashedToken}">Click Here</a>to verify your email or copy paste the link in your browser<br>
            ${process.env.DOMAIN}/resetPassword/?token=${hashedToken}</p>`;
            subject='Reset Your Password';
        }
        else if(emailType==='bookingSuccess'){
            html = `<p>Booking Successfull for order id :${orderId}</p>`;
            subject='Booking successfull';
        }
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });
        const mailOptions = {
            from: 'admin@gmail.com',
            to: email,
            subject: subject,
            html: html,
        };
        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {

    }
}