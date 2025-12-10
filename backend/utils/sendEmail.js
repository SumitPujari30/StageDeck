import nodemailer from 'nodemailer';

const buildTransportConfig = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email credentials are not configured. Please set EMAIL_USER and EMAIL_PASS in your environment.');
  }

  if (EMAIL_HOST || EMAIL_PORT) {
    const port = Number(EMAIL_PORT) || 587;
    return {
      host: EMAIL_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    };
  }

  return {
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  };
};

const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport(buildTransportConfig());

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'StageDeck <noreply@stagedeck.com>',
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
