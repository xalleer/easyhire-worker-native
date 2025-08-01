import api from "@/services/api";
import {Transaction} from "@/models/transaction.model";

export const getTransactionsApi = async (): Promise<Transaction> => {
    const response = await api.get(`/transactions`);
    return response.data;
}