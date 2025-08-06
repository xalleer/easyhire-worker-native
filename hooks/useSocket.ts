import { disconnectSocket, initializeSocket, updateUserId } from '@/services/socket';
import { useEffect } from 'react';

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
