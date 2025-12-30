import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5001,
    mongoUri: process.env.MONGO_URI_PROD || 'mongodb+srv://juggernaut:qwertyuioasdfghikl@cluster0.gjx5nxw.mongodb.net/?appName=Cluster0',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'supersecretkey123',
};
