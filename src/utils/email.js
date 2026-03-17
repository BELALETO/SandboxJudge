import nodemailer from 'nodemailer';
import config from '../config/config.js';

const { email } = config;

if (!email.smtpUser || !email.smtpPass || !email.from) {
  console.warn(
    'Email configuration is incomplete. Please set the SMTP user, password, and from address in the environment variables.'
  );
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: email.smtpUser,
      pass: email.smtpPass
    }
  });

  const mailOptions = {
    from: `"My App" <${email.from}>`,
    to,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    messageId: info.messageId,
    response: info.response
  };
}
