import api from "@/services/api";
import {User} from "@/models/user.model";

export const getMeApi = async (): Promise<User> => {
    const response = await api.get("/user/me");
    return response.data;
};