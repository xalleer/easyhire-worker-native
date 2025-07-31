import { useEffect } from 'react';
import { initializeSocket, disconnectSocket, updateUserId } from '@/services/socket';

export const useSocket = (userId: string | null) => {
    useEffect(() => {
        if (userId) {
            initializeSocket(userId);
        }

        return () => {
            disconnectSocket();
        };
    }, [userId]);

    useEffect(() => {
        if (userId) {
            updateUserId(userId);
        }
    }, [userId]);
};
