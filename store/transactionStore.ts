import {Transaction} from "@/models/transaction.model";
import {create} from "zustand";


interface TransactionStore {
    transactions: Transaction[];
    setTransactions(transactions: Transaction[]): void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
    transactions: [],
    setTransactions: (trans) => set({transactions: trans}),
}));