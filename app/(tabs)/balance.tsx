import {View, Text, StyleSheet} from "react-native";
import colors from "@/theme/colors";
import IconWalletSecondary from "@/assets/icons/IconWalletSecondary";
import ButtonUi from "@/components/ui/ButtonUi";
import typography from "@/theme/typography";
import TransactionItem from "@/components/TransactionItem";
import IconPercent from "@/assets/icons/IconPercent";
import IconDeposit from "@/assets/icons/IconDeposit";
import IconPayForTask from "@/assets/icons/IconPayForTask";
import IconTransactionWithdraw from "@/assets/icons/IconTransactionWithdraw";
export default function BalanceScreen () {
    return (
        <View style={styles.container}>
            <View style={styles.balanceCard}>
                <Text style={[typography.title, {fontSize: 16}]}>Balance</Text>
                <View style={styles.balance}>
                    <IconWalletSecondary/>
                    <Text style={typography.title}>2 455.25 UAH</Text>
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
                    <TransactionItem icon={<IconPercent/>} title={'Commission'} subtitle={'Task: Load car'} amount={-100} date={'12:00'}/>
                    <TransactionItem icon={<IconDeposit/>} title={'Deposit'} subtitle={'From ATM'} amount={100} date={'12:00'}/>
                    <TransactionItem icon={<IconPayForTask/>} title={'Salary'} subtitle={'Salary for Task'} amount={100.50} date={'13:00'}/>
                    <TransactionItem icon={<IconTransactionWithdraw/>} title={'Withdraw'} subtitle={'Salary for Task'} amount={-100.50} date={'13:00'}/>
                </View>


            </View>
        </View>
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