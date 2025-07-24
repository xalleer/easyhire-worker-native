import {Text, View, StyleSheet} from "react-native";
import IconApple from "@/assets/icons/IconApple";
import IconGoogle from "@/assets/icons/IconGoogle";
import colors from "@/theme/colors";

export default function SocialLogin() {
    return (
        <View style={styles.socialContainer}>
            <Text style={{color: colors.noteColor}}>Sign In With</Text>
            <View style={styles.socialIcons}>
                <IconApple/>
                <IconGoogle/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    socialContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginTop: 32,
    },
    socialIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
    },
});