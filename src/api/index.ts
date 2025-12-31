import { IncomingMessage, ServerResponse } from 'http';
import app from '../app';
import { connectDB } from '../config/db';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    await connectDB();
    app(req as any, res as any);
}
