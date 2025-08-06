import { TopupWalletRequest } from "@/models/payment.model";
import api from "@/services/api";

export const topupWalletApi = async (userId: string, body: TopupWalletRequest) => {
    const response = await api.post(`/payment/topup?userId=${userId}`, body);
    return response.data;
};