import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export default {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1',
  mongoURI: process.env.MONGO_URI,
  mongoURIProd: process.env.MONGO_URI_PROD,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRES_IN,
  env: process.env.NODE_ENV || 'development',
  redisURL: process.env.REDIS_URL || 'redis://localhost:6379',
  email: {
    from: process.env.EMAIL_FROM,
    smtpUser: process.env.MAILJET_API_KEY,
    smtpPass: process.env.MAILJET_SECRET
  }
};
