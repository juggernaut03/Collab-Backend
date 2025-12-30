import { Server, Socket } from 'socket.io';
import Doc from '../models/Document';

export const documentSocket = (io: Server, socket: Socket) => {
    socket.on('join-document', async (documentId: string) => {
        socket.join(documentId);
        console.log(`User ${socket.id} joined document ${documentId}`);

        // Load document from DB (Optional: could send initial state here)
        // const document = await Doc.findById(documentId);
        // socket.emit('load-document', document?.content);
    });

    socket.on('send-changes', (delta, documentId) => {
        const room = io.sockets.adapter.rooms.get(documentId);
        const numClients = room ? room.size : 0;
        console.log(`Broadcasting changes for doc ${documentId} to ${numClients - 1} other clients (Total in room: ${numClients})`);

        // Broadcast changes to everyone else in the room
        socket.to(documentId).emit('receive-changes', delta);
    });

    socket.on('save-document', async (content, documentId) => {
        await Doc.findByIdAndUpdate(documentId, { content });
        console.log(`Document ${documentId} saved`);
    });

    socket.on('leave-document', (documentId) => {
        socket.leave(documentId);
        console.log(`User ${socket.id} left document ${documentId}`);
    });

    // WebRTC Signaling
    socket.on('offer', (payload) => {
        io.to(payload.target).emit('offer', payload);
    });

    socket.on('answer', (payload) => {
        io.to(payload.target).emit('answer', payload);
    });

    socket.on('ice-candidate', (payload) => {
        io.to(payload.target).emit('ice-candidate', payload);
    });

    // Notify other users in the room that a new user has joined for video
    // We can reuse the existing join-document or add a specific one.
    // Let's add a specific one to trigger the video flow explicitly.
    socket.on('join-video', (documentId) => {
        const room = io.sockets.adapter.rooms.get(documentId);
        const otherUsers = room ? Array.from(room).filter(id => id !== socket.id) : [];
        socket.emit('all-users', otherUsers);
    });
};
