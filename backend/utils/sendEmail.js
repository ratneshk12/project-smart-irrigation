const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: {
      user: config.SMTP_EMAIL,
      pass: config.SMTP_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: `${config.FROM_NAME} <${config.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;