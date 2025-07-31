
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io('https://easy-hire-backend.onrender.com', {
            withCredentials: true,
            autoConnect: false,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
    }
    return socket;
};

export const initializeSocket = (userId: string) => {
    const socket = getSocket();

    if (!socket.connected && userId) {
        socket.connect();

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('registerUser', userId);
        });

        socket.on('reconnect', () => {
            console.log('Socket reconnected');
            socket.emit('registerUser', userId);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket error:', error);
        });
    }
};

export const updateUserId = (userId: string) => {
    const socket = getSocket();
    if (socket.connected) {
        socket.emit('registerUser', userId);
    }
};

export const disconnectSocket = () => {
    const socket = getSocket();
    if (socket.connected) {
        socket.disconnect();
    }
};

export default getSocket();
