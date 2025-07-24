import IconEdit from "@/assets/icons/IconEdit";
import IconStar from "@/assets/icons/IconStar";
import IconCompletedOrders from "@/assets/icons/IconCompletedOrders";
import IconSetting from "@/assets/icons/IconSetting";
import IconLogout from "@/assets/icons/IconLogout";
import { router } from "expo-router";
export const listItems = [
    {
        title: "Update profile",
        subtitle: "Change your name, email, and password",
        Icon: IconEdit,
        onPress: () => {},
    },
    {
        title: "My rating",
        subtitle: "Check your rating and reviews",
        Icon: IconStar,
        onPress: () => {},
    },
    {
        title: "Completed orders",
        subtitle: "Check your completed orders",
        Icon: IconCompletedOrders,
        onPress: () => {},
    },
    {
        title: "Settings",
        subtitle: "Setup your app for yourself",
        Icon: IconSetting,
        onPress: () => {},
    },
    {
        title: "Logout",
        subtitle: "Logout from account",
        Icon: IconLogout,
        onPress: () => {},
    },
];