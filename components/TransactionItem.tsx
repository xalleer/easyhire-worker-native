import { TransactionType } from "@/models/transaction.model";
import typography from "@/theme/typography";
import { formatDateToTime } from "@/utils/formatDateToTime";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    icon: React.ReactNode;
    title: TransactionType;
    subtitle: string;
    amount: number;
    date: string;
};

export default function TransactionItem({ icon, title, subtitle, amount, date }: Props) {
    const formattedAmount = `${amount < 0 ? '-' : '+'}$${Math.abs(amount).toFixed(2)}`;

    let amountStyle = typography.transactionPlus;
    if (title === TransactionType.COMMISSION) {
        amountStyle = typography.transactionMinus;
    } else if (title === TransactionType.WITHDRAW) {
        amountStyle = typography.transactionWithdraw;
    }

    return (
        <View style={styles.transactionItem}>
            <View style={styles.leftSection}>
                {icon}
                <View style={{ marginLeft: 16 }}>
                    <Text style={[typography.title, { fontSize: 16 }]}>{title}</Text>
                    <Text style={[typography.subtitle]}>{subtitle}</Text>
                </View>
            </View>

            <View style={styles.transactionAmount}>
                <Text style={amountStyle}>{formattedAmount}</Text>
                <Text style={typography.subtitle}>{formatDateToTime(date)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    transactionItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
        gap: 16,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        width: '70%'
    },
    transactionAmount: {
        alignItems: "flex-end",
    },
});