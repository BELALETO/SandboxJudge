// import nodemailer from 'nodemailer';
import config from '../config/config.js';
const { email } = config;

const { smtpUser, smtpPass, from } = email;

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'in.mailjet.com',
  port: 587,
  secure: false, // Mailjet supports STARTTLS on 587
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

export async function sendEmail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: from,
    to,
    subject,
    text,
    html
  });
  return info;
}
