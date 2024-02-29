import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  ttl: {
    wallet_nonce: parseInt(process.env.WALLET_NONCE_TTL, 10) || 300000,
    email_otp: parseInt(process.env.WALLET_NONCE_TTL, 10) || 600000,
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '5m',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30m',
  },
}));
