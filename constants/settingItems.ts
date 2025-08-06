
import { router } from "expo-router";
import IconLanguage from "@/assets/icons/IconLanguage";
import ThemeIcon from "@/assets/icons/ThemeIcon";

export const getSettingItems = () => [
    {
        title: "Language",
        subtitle: "You can change your language",
        Icon: IconLanguage,
        onPress: () => router.push("/edit-profile"),
    },
    {
        title: "Theme",
        subtitle: "Change your theme dark/light",
        Icon: ThemeIcon,
        onPress: () => router.push("/edit-profile"),
    },


];
