import { loginApi } from '@/api/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

interface LoginInput {
  phone?: string;
  email?: string;
  password: string;
}

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError(null);

      const res = await loginApi(data);
      console.log(res);

      const { token, user } = res;
      setToken(token);
      setUser(user);

      router.replace('/(tabs)/tasks');
    } catch (e: any) {
      setError(e.message || 'Login failed');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}