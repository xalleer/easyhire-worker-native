import { User } from '@/models/user.model';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  loadTokenFromStorage: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: async (token) => {
    await SecureStore.setItemAsync('token', token);
    set({ token });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ user: null, token: null });
  },
   loadTokenFromStorage: async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) set({ token });
  },


}))