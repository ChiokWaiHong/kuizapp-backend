// config/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = async () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your KuizApp Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to KuizApp!</h2>
          <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
          <div style="font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">${verificationCode}</div>
          <p>Simply enter this code on the <a href="https://localhost:3000/verify-email?email=${encodeURIComponent(email)}">verification page</a> to confirm your email address.</p>
          <p>If you didn't sign up for KuizApp, you can safely ignore this email.</p>
          <p>Thanks,<br>The KuizApp Team</p>
        </div>
      `,
      text: `Your KuizApp verification code is: ${verificationCode}. Enter this code on the verification page to complete your registration.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

module.exports = sendVerificationEmail;
