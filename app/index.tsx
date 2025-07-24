import { Redirect } from 'expo-router';
import {useAuthStore} from "@/store/authStore";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.token);
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/tasks" />;
  }
  
  return <Redirect href="/(auth)/welcome" />;
}