import {StyleSheet, Text, View} from "react-native";
import AccountListItem from "@/components/AccountListItem";
import colors from "@/theme/colors";
import {getSettingItems} from "@/constants/settingItems";

export default function Settings(){

    const listItems = getSettingItems()
    return (
        <View style={styles.container}>
            <View style={styles.list}>


                {listItems.map((item, index) => (
                    <AccountListItem key={index} {...item} />
                ))}

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 32,
        paddingHorizontal: 24,
        backgroundColor: colors.background
    },
    list: {
        gap: 16,
        width: '100%',
    }

});