import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5001,
    mongoUri: process.env.MONGO_URI || process.env.MONGO_URI_PROD || 'mongodb+srv://collab:DBaDz2aY0spdZo5f@collab.fkcpiow.mongodb.net/?appName=collab',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '',
    jwtSecret: process.env.JWT_SECRET || 'supersecretkey123',
};
