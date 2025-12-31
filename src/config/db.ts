import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(config.mongoUri, {
            serverSelectionTimeoutMS: 5000, // Fail fast if IP is blocked
        });

        if (conn.connection.host.includes('mongodb.net')) {
            console.log(`MongoDB Connected to Atlas Database: ${conn.connection.host}`);
        } else {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        // Do not exit process in serverless, just throw so the handler catches it
        throw error;
    }
};
