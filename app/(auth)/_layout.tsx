import Header from '@/components/Header';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
    <StatusBar style="dark" />

    <Stack
      screenOptions={{
        header: ({ route }) => {
          const titleMap: Record<string, string> = {
            login: 'Вхід',
            register: 'Реєстрація',
          };
          return (
            <Header
              title={titleMap[route.name] || 'Easy Hire'}
              showBack={route.name !== 'welcome'}
            />
          );
        },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
    </>
      

  );
}