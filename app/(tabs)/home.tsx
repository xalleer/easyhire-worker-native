import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const handleLogout = () => {
    // Тут додайте логіку виходу (очистити токени тощо)
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Привіт, Hello</Text>
      <Text style={styles.token}>Token: test</Text>
      <Button title="Вийти" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 10,
  },
  token: {
    fontSize: 16,
    marginBottom: 20,
  },
});