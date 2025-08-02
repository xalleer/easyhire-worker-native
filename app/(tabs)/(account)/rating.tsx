import IconStarSecondary from "@/assets/icons/IconStarSecondary";
import AvatarUi from "@/components/ui/AvatarUi";
import { useUserStore } from "@/store/userStore";
import colors from "@/theme/colors";
import typography from "@/theme/typography";
import { StyleSheet, Text, View } from "react-native";


export default function Rating() {
    const {user} = useUserStore()
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', gap: 18, justifyContent: 'center' }}>
                <AvatarUi size={74} name={user?.name}></AvatarUi>
                <View style={ { flexDirection: 'column', alignItems: 'flex-start', gap: 10, justifyContent: 'center'}}>
                    <Text style={typography.subheading}>{user?.name}</Text>
                    <View style={ { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center'}}>
                            <IconStarSecondary/>
                            <Text>{ user?.rating?.toFixed(2) }</Text>
                    </View>
                </View>
            </View>

        <View style={styles.reviewCard}>
            <View style={ styles.reviewCardHeader }>
                <AvatarUi size={32} name={user?.name}></AvatarUi>
                <View style={ { flexDirection: 'column', alignItems: 'flex-start', gap: 4, justifyContent: 'center'}}>
                    <Text style={typography.subheading}>{user?.name}</Text>
                    <View style={ { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center'}}>
                            <IconStarSecondary/>
                            <IconStarSecondary/>
                            <IconStarSecondary/>
                            <IconStarSecondary/>
                            <IconStarSecondary/>

                    </View>
                </View>
            </View>

            <Text style={typography.subtitle}>Lorem ipsum purd mosk default hasg
            sennrt ipsum description</Text>

            

            <Text style={[{ textAlign: 'right', }]}>July 14, 2022</Text>
        </View>
           
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        backgroundColor: colors.background,
        flex: 1
    },
    reviewCard: {
        borderWidth: 1, 
        borderStyle: 'solid', 
        borderColor: colors.borderColor,
        padding: 16,
        borderRadius: 16,
        gap: 16
    },
    reviewCardHeader: {
        flexDirection: 'row',
        gap: 8,  
        width: '100%',
        alignItems: 'center'
    },
    
})