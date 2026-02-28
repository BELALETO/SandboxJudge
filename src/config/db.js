import mongoose from 'mongoose';
import config from './config.js';
import { catchAsync } from '../utils/catchAsync.js';
import { appLogger } from '../utils/logger.js';

const { mongoURI, mongoURIProd } = config;

export const connectDB = catchAsync(async () => {
  const uri = process.env.ENV === 'production' ? mongoURIProd : mongoURI;
  await mongoose.connect(uri);
  appLogger.info('Database connected');
});

export const disconnectDB = catchAsync(async () => {
  await mongoose.disconnect();
  appLogger.info('Database disconnected');
});
