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
import { formatBalance } from "@/utils/formatBalance";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

export default function BalanceScreen() {
    const { user } = useUserStore();
    const { transactions, setTransactions } = useTransactionStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isDepositSheetVisible, setDepositSheetVisible] = useState(false);
    const [depositAmount, setDepositAmount] = useState('200');
    const [refreshing, setRefreshing] = useState(false);
    const [depositLoading, setDepositLoading] = useState(false);

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const balanceScaleAnim = useRef(new Animated.Value(1)).current;

    // Entry animation
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const fetchTransactions = async (showLoader = false) => {
        try {
            if (showLoader) setLoading(true);
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
            Alert.alert('Помилка', 'Не вдалося завантажити транзакції');
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchTransactions();
            
            // Balance refresh animation
            Animated.sequence([
                Animated.timing(balanceScaleAnim, {
                    toValue: 1.05,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(balanceScaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions(true);
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
                return "Комісія";
            case "deposit_card":
                return "Поповнення картою";
            case "deposit_task":
                return "Оплата завдання";
            case "withdraw":
                return "Виведення коштів";
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
            setDepositLoading(true);
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
                    
                    const url = `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;
                    
                    setPaymentHtml(`
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <title>LiqPay Payment</title>
                            </head>
                            <body style="margin: 0; padding: 20px; font-family: system-ui; text-align: center; background: ${colors.background};">
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
                Alert.alert('Помилка', 'Не вдалося створити платіж');
            }
            setDepositSheetVisible(false);
        } catch (error) {
            console.error("Deposit error:", error);
            Alert.alert('Помилка', 'Не вдалося створити платіж');
        } finally {
            setDepositLoading(false);
        }
    };

    const formatDateHeader = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) return 'Сьогодні';
        if (isYesterday) return 'Вчора';

        return date.toLocaleDateString('uk-UA', {
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
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.lightGreen]}
                        tintColor={colors.lightGreen}
                        title="Оновлення балансу..."
                        titleColor={colors.lightGreen}
                    />
                }
            >
                <Animated.View 
                    style={[
                        styles.balanceCard,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: balanceScaleAnim }
                            ],
                        },
                    ]}
                >
                    <Text style={styles.balanceTitle}>Баланс</Text>
                    <View style={styles.balance}>
                        <IconWalletSecondary />
                        <Text style={styles.balanceAmount}>
                            {formatBalance(user?.balance)} UAH
                        </Text>
                    </View>
                    <View style={styles.buttons}>
                        <ButtonUi 
                            onPress={() => {
                                Alert.alert('Інформація', 'Функція виведення коштів буде доступна незабаром');
                            }} 
                            style={styles.actionButton} 
                            title={'Вивести'} 
                            variant={'outline'}
                        />
                        <ButtonUi 
                            onPress={() => setDepositSheetVisible(true)} 
                            style={styles.actionButton} 
                            title={'Поповнити'} 
                            variant={'clear'}
                        />
                    </View>
                </Animated.View>

                <Animated.View 
                    style={[
                        styles.transactions,
                        {
                            opacity: fadeAnim,
                            transform: [{ 
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 50],
                                    outputRange: [0, 30],
                                })
                            }],
                        },
                    ]}
                >
                    <Text style={styles.transactionsTitle}>Транзакції</Text>
                    
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <ButtonUi 
                                title="Повторити" 
                                variant="outline" 
                                onPress={() => fetchTransactions(true)}
                                style={styles.retryButton}
                            />
                        </View>
                    )}
                    
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Завантаження транзакцій...</Text>
                        </View>
                    ) : sortedDates.length > 0 ? (
                        sortedDates.map((date, dateIndex) => (
                            <Animated.View 
                                key={date} 
                                style={[
                                    styles.dateGroup,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateY: slideAnim.interpolate({
                                                inputRange: [0, 50],
                                                outputRange: [0, 20 + (dateIndex * 5)],
                                            })
                                        }],
                                    },
                                ]}
                            >
                                <Text style={styles.dateHeader}>
                                    {formatDateHeader(date)}
                                </Text>
                                <View style={styles.transactionsList}>
                                    {groupedTransactions[date].map((transaction, index) => (
                                        <Animated.View
                                            key={`${date}-${index}`}
                                            style={[
                                                styles.transactionItem,
                                                {
                                                    opacity: fadeAnim,
                                                    transform: [{
                                                        translateX: slideAnim.interpolate({
                                                            inputRange: [0, 50],
                                                            outputRange: [0, 10 + (index * 2)],
                                                        })
                                                    }],
                                                },
                                            ]}
                                        >
                                            <TransactionItem
                                                icon={getTransactionIcon(transaction.type)}
                                                title={getTransactionTitle(transaction.type)}
                                                subtitle={transaction.description!}
                                                amount={transaction.amount}
                                                date={transaction.date}
                                            />
                                        </Animated.View>
                                    ))}
                                </View>
                            </Animated.View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Транзакцій поки немає</Text>
                            <Text style={styles.emptySubtext}>
                                Потягніть вниз, щоб оновити
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            <BottomSheet
                visible={isDepositSheetVisible}
                onClose={() => setDepositSheetVisible(false)}
                height={350}
            >
                <View style={styles.depositContent}>
                    <Text style={styles.depositTitle}>Поповнення балансу</Text>
                    <InputUi
                        value={depositAmount}
                        onChangeText={setDepositAmount}
                        placeholder="Введіть суму"
                        type="text"
                        style={styles.depositInput}
                    />
                    <Text style={styles.depositHint}>
                        Мінімальна сума поповнення: 50 UAH
                    </Text>
                    <ButtonUi
                        title="Поповнити"
                        onPress={() => {
                            const amountNum = Number(depositAmount);
                            if (isNaN(amountNum) || amountNum < 50) {
                                Alert.alert("Помилка", "Введіть коректну суму (мінімум 50 UAH)");
                                return;
                            }
                            deposit(amountNum);
                        }}
                        loading={depositLoading}
                        disabled={depositLoading}
                    />
                </View>
            </BottomSheet>

            <PaymentModal
                visible={showPaymentModal}
                htmlContent={paymentHtml}
                onClose={closePaymentModal}
                onNavigationStateChange={onWebViewNavigationStateChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingTop: 16,
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    balanceCard: {
        width: '100%',
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 20,
        padding: 20,
        gap: 20,
        marginBottom: 24,
    },
    balanceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    balance: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    balanceAmount: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.black,
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: colors.borderColor,
    },
    actionButton: {
        flex: 1,
    },
    transactions: {
        width: '100%',
        gap: 20,
    },
    transactionsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.black,
    },
    dateGroup: {
        width: '100%',
        gap: 12,
        marginBottom: 20,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.noteColor,
        marginBottom: 8,
    },
    transactionsList: {
        gap: 12,
        width: '100%',
    },
    transactionItem: {
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 16,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
    },
    retryButton: {
        minWidth: 120,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: colors.noteColor,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 8,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.noteColor,
        textAlign: 'center',
    },
    depositContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        gap: 20,
    },
    depositTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
    depositInput: {
        marginBottom: 8,
    },
    depositHint: {
        fontSize: 14,
        color: colors.noteColor,
        textAlign: 'center',
        marginBottom: 16,
    },
});