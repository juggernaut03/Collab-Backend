import { IncomingMessage, ServerResponse } from 'http';
import app from '../app';
import { connectDB } from '../config/db';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    console.log('API Handler started');
    try {
        await connectDB();
        console.log('DB Connection initialized, delegating to app');
        app(req as any, res as any);
    } catch (e) {
        console.error('DB Connection Failed hard:', e);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DB Connection Failed', details: (e as Error).message }));
    }
}
