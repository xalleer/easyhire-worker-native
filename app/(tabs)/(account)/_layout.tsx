import { Stack } from 'expo-router';
import Header from "@/components/Header";

export default function AccountLayout() {
    return (
        <Stack
            screenOptions={{
                header: ({ route}) => {


                    if(route.name === 'index') {
                        return null
                    }

                    return (
                        <Header title={route.name}/>
                    )
                }
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Акаунт',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="edit-profile"
                options={{
                    title: 'Редагувати профіль',
                    headerBackTitle: 'Назад'
                }}
            />
            <Stack.Screen
                name="rating"
                options={{
                    title: 'Rating',
                    headerBackTitle: 'Назад'
                }}
            />
            <Stack.Screen
                name="completed-orders"
                options={{
                    title: 'Completed Orders',
                    headerBackTitle: 'Назад'
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    headerBackTitle: 'Назад'
                }}
            />

        </Stack>
    );
}