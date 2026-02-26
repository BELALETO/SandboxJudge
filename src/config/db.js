import mongoose from 'mongoose';
import config from './config.js';
import { catchAsync } from '../utils/catchAsync.js';

const { mongoURI, mongoURIProd } = config;

export const connectDB = catchAsync(async () => {
  const uri = process.env.ENV === 'production' ? mongoURIProd : mongoURI;
  await mongoose.connect(uri);
  console.log('Database connected');
});

export const disconnectDB = catchAsync(async () => {
  await mongoose.disconnect();
  console.log('Database disconnected');
});
