// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  const isAuthenticated = false; 
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }
  
  return <Redirect href="/(auth)/welcome" />;
}