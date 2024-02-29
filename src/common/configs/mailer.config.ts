import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  service: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 0,
    secure: process.env.SMTP_SECURE
      ? JSON.parse(process.env.SMTP_SECURE)
      : false,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
  senderCredentials: {
    name: process.env.SMTP_CREDENTIAL_NAME || '',
    email: process.env.SMTP_CREDENTIAL_EMAIL || '',
  },
}));
