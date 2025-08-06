import {TopupWalletRequest} from "@/models/payment.model";

export const topupWalletApi = async (body: TopupWalletRequest) => {
    const response = await api.post(`/payment/topup-wallet`, body);
    return response.data;
};