// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  const isAuthenticated = false; 
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/tasks" />;
  }
  
  return <Redirect href="/(auth)/welcome" />;
}