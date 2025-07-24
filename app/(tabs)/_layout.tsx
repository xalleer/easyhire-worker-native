import Header from '@/components/Header';
import { Tabs } from 'expo-router';
import IconProfile from "@/assets/icons/IconProfile";
import colors from "@/theme/colors";
import IconTasks from "@/assets/icons/IconTasks";
import IconWallet from "@/assets/icons/IconWallet";
import IconNotifications from "@/assets/icons/IconNotifications";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{

                tabBarStyle: {
                    position: 'absolute',
                    width: '90%',
                    bottom: 30,
                    marginHorizontal: 24,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    height: 60,
                    paddingTop: 10,
                    paddingBottom: 10,
                    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
                },
                tabBarShowLabel: false,

                headerShown: false,
                header: ({ route }) => {
                    const titleMap: Record<string, string> = {
                        account: 'Головна',
                        tasks: 'Завдання',
                        balance: 'Баланс',
                        notifications: 'Сповіщення',
                    };
                    return (
                        <Header
                            title={titleMap[route.name] || 'Easy Hire'}
                            showBack={false}
                        />
                    );
                },
            }}
        >
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Профіль',
                    tabBarIcon: ({ focused }) => (
                        <IconProfile size={24} color={focused ? colors.lightGreen : colors.black}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Завдання',
                    tabBarIcon: ({ focused }) => (
                        <IconTasks size={24} color={focused ? colors.lightGreen : colors.black}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="balance"
                options={{
                    title: 'Баланс',
                    tabBarIcon: ({ focused }) => (
                        <IconWallet size={24} color={focused ? colors.lightGreen : colors.black}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Сповіщення',
                    tabBarIcon: ({ focused }) => (
                        <IconNotifications size={24} color={focused ? colors.lightGreen : colors.black}/>
                    ),
                }}
            />
        </Tabs>
    );
}