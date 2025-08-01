
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import ButtonUi from "@/components/ui/ButtonUi";
import colors from "@/theme/colors";
import typography from "@/theme/typography";

export default function WelcomeScreen() {
 

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={typography.title}>Welcome</Text>
            <Text style={[{ marginTop: 20 }, typography.subtitle]}>This is the welcome screen.</Text>
        </View>


        <Image style={{width: '100%', height: 300}} source={require('@/assets/images/welcome.png')}/>


        <View style={styles.footer}>
            <ButtonUi title={'Go to Login'} onPress={() => router.push('/(auth)/login')} />
            <ButtonUi variant={'outline'} title={'Go to Register'} onPress={() => router.push('/(auth)/register')} />
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      paddingTop: 24,
    paddingHorizontal: 24,
      backgroundColor: colors.background,
    flex: 1,
      gap: 50,
    justifyContent: 'flex-start',
    
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
    header: {
        alignItems: 'center',

    },
    footer: {
      position: 'absolute',
        width: '100%',
      bottom: 24,
        left: 24,
    }
});