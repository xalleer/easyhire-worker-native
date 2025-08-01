import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import {logoutApi} from "@/api/auth";

export const useLogout = () => {
    const setLogout = useAuthStore(state => state.logout);
    const router = useRouter();

    const logout = async () => {
        try {
            setLogout();
            router.replace("/login");
            logoutApi()
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return {logout};
};
