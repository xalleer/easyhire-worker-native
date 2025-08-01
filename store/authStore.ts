import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import {router} from "expo-router";

interface AuthStore {
    token: string | null;
    setToken: (token: string) => void;
    logout: () => void;
    loadTokenFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    setToken: async (token) => {
        await SecureStore.setItemAsync('token', token);
        set({ token });
    },
    logout: async () => {
        localStorage.clear();
        await SecureStore.deleteItemAsync('token');
        router.replace('/(auth)/login')
    },
    loadTokenFromStorage: async () => {
        const token = await SecureStore.getItemAsync('token');
        if (token) set({ token });
    },


}))