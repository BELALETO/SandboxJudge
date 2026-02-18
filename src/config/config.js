import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1',
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRES_IN,
  env: process.env.NODE_ENV || 'development'
};
