import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

import mongoose from 'mongoose';
app.get('/debug-db', async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        const stateStr = ['disconnected', 'connected', 'connecting', 'disconnecting'][state] || 'unknown';
        const start = Date.now();
        let ping = -1;
        if (state === 1) {
            await mongoose.connection.db?.admin().ping();
            ping = Date.now() - start;
        }
        res.json({ state, stateStr, ping, mongoUri: config.mongoUri.replace(/:([^@]+)@/, ':****@') });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

export default app;
