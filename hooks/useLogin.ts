import { loginApi } from '@/api/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { useUserStore } from '../store/userStore';


interface LoginInput {
  phone?: string
  email?: string;
  password: string;
}

export function useLogin() {
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError(null);

      const user = await loginApi(data);
      console.log(user);

      
      setUser(user);
      router.replace('/(tabs)/tasks');
      
    } catch (e: any) {
      setError(e.message);
      console.log(e);
      console.log(data);
      
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}