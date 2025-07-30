import axios from 'axios';
import {useAuthStore} from "@/store/authStore";
const api = axios.create({
  baseURL: 'https://easy-hire-backend.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    async (config) => {
        const token = useAuthStore.getState().token;
        console.log('Auth token in interceptor:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;