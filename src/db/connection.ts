import mongoose from 'mongoose';

let connected = false;

export const connectDatabase = async (): Promise<void> => {
  if (connected) return;
  const uri = process.env.MONGODB_ROUTE;
  if (!uri) {
    throw new Error('MONGODB_ROUTE is not defined in .env');
  }
  await mongoose.connect(uri);
  connected = true;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
};
