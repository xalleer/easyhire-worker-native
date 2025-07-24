import { useUserStore } from '@/store/userStore';
import axios from 'axios';
const api = axios.create({
  baseURL: 'https://easy-hire-backend.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;