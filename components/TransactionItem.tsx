import { Text, View, StyleSheet } from "react-native";
import typography from "@/theme/typography";

type Props = {
    icon: React.ReactNode;
    title: 'Deposit' | 'Withdraw' | 'Salary' | 'Commission';
    subtitle: string;
    amount: number;
    date: string;
};

export default function TransactionItem({ icon, title, subtitle, amount, date }: Props) {
    const formattedAmount = `${amount < 0 ? '-' : '+'}$${Math.abs(amount).toFixed(2)}`;

    let amountStyle = typography.transactionPlus;
    if (title === 'Commission') {
        amountStyle = typography.transactionMinus;
    } else if (title === 'Withdraw') {
        amountStyle = typography.transactionWithdraw;
    }

    return (
        <View style={styles.transactionItem}>
            <View style={styles.leftSection}>
                {icon}
                <View style={{ marginLeft: 16 }}>
                    <Text style={[typography.title, { fontSize: 16 }]}>{title}</Text>
                    <Text style={typography.subtitle}>{subtitle}</Text>
                </View>
            </View>

            <View style={styles.transactionAmount}>
                <Text style={amountStyle}>{formattedAmount}</Text>
                <Text style={typography.subtitle}>{date}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    transactionItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    transactionAmount: {
        alignItems: "flex-end",
    },
});