import { topupWalletApi } from "@/api/payment";
import { getTransactionsApi } from "@/api/transaction";
import IconDeposit from "@/assets/icons/IconDeposit";
import IconPayForTask from "@/assets/icons/IconPayForTask";
import IconPercent from "@/assets/icons/IconPercent";
import IconTransactionWithdraw from "@/assets/icons/IconTransactionWithdraw";
import IconWalletSecondary from "@/assets/icons/IconWalletSecondary";
import BottomSheet from "@/components/BottomSheet";
import PaymentModal from "@/components/modals/PaymentModal";
import TransactionItem from "@/components/TransactionItem";
import ButtonUi from "@/components/ui/ButtonUi";
import InputUi from "@/components/ui/InputUi";
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
    const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isDepositSheetVisible, setDepositSheetVisible] = useState(false);
    const [depositAmount, setDepositAmount] = useState('200');

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

    const deposit = async (amount: number) => {
        try {
            const response = await topupWalletApi(user!._id, {
                amount: amount,
                type: "topup",
            });

            if (response && typeof response.html === "string") {
                const formHtml = response.html;
                
                const dataMatch = formHtml.match(/name="data"\s+value="([^"]+)"/);
                const signatureMatch = formHtml.match(/name="signature"\s+value="([^"]+)"/);
                
                if (dataMatch && signatureMatch) {
                    const data = dataMatch[1];
                    const signature = signatureMatch[1];
                    
                    console.log('LiqPay data:', data);
                    console.log('LiqPay signature:', signature);
                    
                    const url = `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;
                    
                    setPaymentHtml(`
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <title>LiqPay Payment</title>
                            </head>
                            <body style="margin: 0; padding: 20px; font-family: system-ui; text-align: center;">
                                <div style="margin-top: 50px;">
                                    <h2 style="color: #333;">Оплата через LiqPay</h2>
                                    <p style="color: #666; margin: 20px 0;">Переходимо до сторінки оплати...</p>
                                    <div style="margin: 30px 0;">
                                        <div style="
                                            width: 40px; 
                                            height: 40px; 
                                            border: 4px solid #f3f3f3; 
                                            border-top: 4px solid #10b981; 
                                            border-radius: 50%; 
                                            animation: spin 1s linear infinite;
                                            margin: 0 auto;
                                        "></div>
                                    </div>
                                </div>
                                <style>
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                </style>
                                <script>
                                    setTimeout(() => {
                                        window.location.href = "${url}";
                                    }, 1500);
                                </script>
                            </body>
                        </html>
                    `);
                    setShowPaymentModal(true);
                
                } else {
                    console.error("Не вдалося знайти data або signature в HTML формі");
                    setPaymentHtml(formHtml);
                    setShowPaymentModal(true);
                }
            } else {
                console.warn("Unexpected response:", response);
            }
            setDepositSheetVisible(false);
        } catch (error) {
            console.error("Deposit error:", error);
        }
    };

    const formatDateHeader = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setPaymentHtml(null);
        fetchTransactions();
    };

    const onWebViewNavigationStateChange = (navState: any) => {
        if (navState.url.includes('success') || navState.url.includes('callback')) {
            console.log('Payment completed, URL:', navState.url);
            setTimeout(closePaymentModal, 2000); 
        }
    };

    const groupedTransactions = groupTransactionsByDate(transactions);
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
    );

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
                        <ButtonUi onPress={() => setDepositSheetVisible(true)} style={{ width: '50%'}} title={'Deposit'} variant={'clear'}/>
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

            <BottomSheet
        visible={isDepositSheetVisible}
        onClose={() => setDepositSheetVisible(false)}
        height={250}
      >
        <View style={styles.content}>
          <InputUi
            value={depositAmount}
            onChangeText={setDepositAmount}
            placeholder="Enter deposit amount"
            type="text"
            style={{ marginBottom: 20 }}
          />
          <ButtonUi
            title="Поповнити"
            onPress={() => {
              const amountNum = Number(depositAmount);
              if (isNaN(amountNum) || amountNum <= 0) {
                alert("Введіть коректну суму");
                return;
              }
              deposit(amountNum);
            }}
          />
        </View>
      </BottomSheet>

        <PaymentModal
      visible={showPaymentModal}
      htmlContent={paymentHtml}
      onClose={closePaymentModal}
      onNavigationStateChange={onWebViewNavigationStateChange}
    />
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
    modalContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    closeButton: {
        width: 80,
    },
    webview: {
        flex: 1,
    },
    content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});