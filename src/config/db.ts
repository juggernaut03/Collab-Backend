import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        if (conn.connection.host.includes('mongodb.net')) {
            console.log(`MongoDB Connected to Atlas Database: ${conn.connection.host}`);
        } else {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};
