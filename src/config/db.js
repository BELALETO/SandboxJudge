import mongoose from 'mongoose';
import config from './config.js';

const { mongoURI } = config;

export async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Database connected');
  } catch (error) {
    console.error(error);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('Database disconnected');
}
