import api from "@/services/api";
import {ChangeStatusRequest, User} from "@/models/user.model";

export const getMeApi = async (): Promise<User> => {
    const response = await api.get("/user/me");
    return response.data;
};

export const changeStatusApi = async (body: ChangeStatusRequest): Promise<User> => {
    const response = await api.put(`/user/change-status?status=${body.status}`);
    return response.data;
};