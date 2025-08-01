export interface Transaction {
    _id: string;
    type: TransactionType;
    amount: number;
    status: 'success' | 'pending' | 'failed';
    date: string;
    description?: string;
}

export enum TransactionType {
    DEPOSIT = 'deposit_card',
    SALARY = 'deposit_task',
    WITHDRAW = 'withdraw',
    COMMISSION = 'commission',
}