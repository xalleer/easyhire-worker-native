
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

        <Text style={{ marginTop: 20 }}>This is the welcome screen.</Text>

        <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={{ color: 'blue', marginTop: 20 }}>Go to Login</Text>
        </Pressable>

         <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={{ color: 'blue', marginTop: 20 }}>Go to Register</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
    justifyContent: 'center',
    
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});