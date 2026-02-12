import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1',
  mongoURI: process.env.MONGO_URI
};
