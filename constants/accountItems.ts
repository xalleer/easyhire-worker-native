import IconEdit from "@/assets/icons/IconEdit";
import IconStar from "@/assets/icons/IconStar";
import IconCompletedOrders from "@/assets/icons/IconCompletedOrders";
import IconSetting from "@/assets/icons/IconSetting";
import IconLogout from "@/assets/icons/IconLogout";
import { router } from "expo-router";

export const getListItems = (logout: () => void) => [
    {
        title: "Update (account)",
        subtitle: "Change your name, email, and password",
        Icon: IconEdit,
        onPress: () => router.push("/edit-profile"),
    },
    {
        title: "My rating",
        subtitle: "Check your rating and reviews",
        Icon: IconStar,
        onPress: () => router.push("/rating"),
    },
    {
        title: "Completed orders",
        subtitle: "Check your completed orders",
        Icon: IconCompletedOrders,
        onPress: () => router.push("/completed-orders"),
    },
    {
        title: "Settings",
        subtitle: "Setup your app for yourself",
        Icon: IconSetting,
        onPress: () => router.push("/settings"),
    },
    {
        title: "Logout",
        subtitle: "Logout from account",
        Icon: IconLogout,
        onPress: logout,
    },
];
