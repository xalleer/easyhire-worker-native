import { getTransactionsApi } from "@/api/transaction";
import IconDeposit from "@/assets/icons/IconDeposit";
import IconPayForTask from "@/assets/icons/IconPayForTask";
import IconPercent from "@/assets/icons/IconPercent";
import IconTransactionWithdraw from "@/assets/icons/IconTransactionWithdraw";
import IconWalletSecondary from "@/assets/icons/IconWalletSecondary";
import TransactionItem from "@/components/TransactionItem";
import ButtonUi from "@/components/ui/ButtonUi";
import { Transaction, TransactionType } from "@/models/transaction.model";
import { useTransactionStore } from "@/store/transactionStore";
import { useUserStore } from "@/store/userStore";
import colors from "@/theme/colors";
import typography from "@/theme/typography";
import { formatBalance } from "@/utils/formatBalance";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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

    const getTransactionTitle = (type: TransactionType) => {
        switch (type) {
            case "commission":
                return "Commission";
            case "deposit_card":
                return "Deposit card";
            case "deposit_task":
                return "Deposit task";
            case "withdraw":
                return "Withdraw";
            default:
                return "";
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

    const formatDateHeader = (dateString: string) => {
        // Convert date string to a more readable format
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const groupedTransactions = groupTransactionsByDate(transactions);
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime() // Sort dates in descending order (newest first)
    );

    return (
        <ScrollView >
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
                    
                    {sortedDates.map((date) => (
                        <View key={date} style={styles.dateGroup}>
                            <Text style={[typography.subtitle, styles.dateHeader]}>
                                {formatDateHeader(date)}
                            </Text>
                            <View style={styles.transactionsList}>
                                {groupedTransactions[date].map((transaction, index) => (
                                    <TransactionItem
                                        key={`${date}-${index}`}
                                        icon={getTransactionIcon(transaction.type)}
                                        title={getTransactionTitle(transaction.type)}
                                        subtitle={transaction.description!}
                                        amount={transaction.amount}
                                        date={transaction.date}
                                    />
                                ))}
                            </View>
                        </View>
                    ))}
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
        paddingBottom: 100,
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
        gap: 16,
    },
    dateGroup: {
        width: '100%',
        gap: 12,
    },
    dateHeader: {
        marginBottom: 8,
        color: colors.noteColor,
    },
    transactionsList: {
        gap: 16,
        width: '100%',
    },
});