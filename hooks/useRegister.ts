import { registerApi } from '@/api/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import {RegisterRequest} from "@/models/auth.model";


export function useRegister() {
    const setToken = useAuthStore((s) => s.setToken);
    const setUser = useUserStore((s) => s.setUser);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterRequest) => {
        try {
            setLoading(true);
            setError(null);

            const res = await registerApi(data);
            console.log(res);

            const { token, user } = res;
            setToken(token);
            setUser(user);

            router.replace('/(tabs)/tasks');
        } catch (e: any) {
            setError(e.message || 'SignUp failed');
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
}