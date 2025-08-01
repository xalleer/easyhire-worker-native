import {View, Text, StyleSheet, ScrollView} from "react-native";
import colors from "@/theme/colors";
import IconWalletSecondary from "@/assets/icons/IconWalletSecondary";
import ButtonUi from "@/components/ui/ButtonUi";
import typography from "@/theme/typography";
import TransactionItem from "@/components/TransactionItem";
import IconPercent from "@/assets/icons/IconPercent";
import IconDeposit from "@/assets/icons/IconDeposit";
import IconPayForTask from "@/assets/icons/IconPayForTask";
import IconTransactionWithdraw from "@/assets/icons/IconTransactionWithdraw";
import {useUserStore} from "@/store/userStore";
import {formatBalance} from "@/utils/formatBalance";
import {useEffect, useState} from "react";
import {getTransactionsApi} from "@/api/transaction";
import {useTransactionStore} from "@/store/transactionStore";
import {Transaction, TransactionType} from "@/models/transaction.model";
export default function BalanceScreen () {
    const { user } = useUserStore();
    const {transactions, setTransactions} = useTransactionStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getTransactionsApi();
            if (res && Array.isArray(res)) {
                setTransactions(res);
                console.log("Fetched transactions:", res);
            } else {
                setError("Invalid transaction data received");
                console.warn("Invalid response format:", res);
            }
        } catch (e) {
            console.error("Failed to fetch transactions:", e);
            setError("Failed to load transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const getTransactionIcon = (type: TransactionType) => {
        switch (type) {
            case "commission":
                return <IconPercent />;
            case "deposit_card":
                return <IconDeposit />;
            case "deposit_task":
                return <IconPayForTask />;
            case "withdraw":
                return <IconTransactionWithdraw />;
            default:
                return null;
        }
    };

    const groupTransactionsByDate = (transactions: Transaction[]) => {
        return transactions.reduce((acc: { [key: string]: Transaction[] }, transaction) => {
            const date = transaction.date.split(" ")[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(transaction);
            return acc;
        }, {});
    };

    const groupedTransactions = groupTransactionsByDate(transactions);


    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.balanceCard}>
                    <Text style={[typography.title, {fontSize: 16}]}>Balance</Text>
                    <View style={styles.balance}>
                        <IconWalletSecondary/>
                        <Text style={typography.title}>{formatBalance(user?.balance)} UAH</Text>
                    </View>
                    <View style={styles.buttons}>
                        <ButtonUi onPress={() => {}} style={{ width: '50%'}} title={'Withdraw'} variant={'outline'}/>
                        <ButtonUi onPress={() => {}} style={{ width: '50%'}} title={'Deposit'} variant={'clear'}/>
                    </View>
                </View>

                <View style={styles.transactions}>
                    <Text style={[typography.title, {fontSize: 16}]}>Transactions</Text>
                    <Text style={typography.subtitle}>July 14, 2022</Text>

                    <View style={{gap: 24}}>
                        {transactions.map((transaction, index) => (
                            <TransactionItem
                                key={index}
                                icon={getTransactionIcon(transaction.type)}
                                title={transaction.type}
                                subtitle={transaction.description!}
                                amount={transaction.amount}
                                date={transaction.date}
                            />
                        ))}
                    </View>


                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.background,

    },
    balanceCard: {
        width: '100%',
        backgroundColor: colors.white,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: 16,
        padding: 16,
        gap: 16
    },
    balance: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderColor: colors.borderColor,

    },
    transactions: {
        marginTop: 24,
        width: '100%',
        gap: 16

    },


});