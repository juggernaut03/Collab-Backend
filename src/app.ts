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

import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

export default app;
