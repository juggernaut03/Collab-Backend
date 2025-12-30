import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';

import { documentSocket } from './sockets/documentSocket';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    documentSocket(io, socket);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Connect to Database and Start Server
connectDB().then(() => {
    server.listen(config.port, () => {
        console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
});
