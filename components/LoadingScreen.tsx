import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <LinearGradient
            colors={['#FFD600', '#FF6B00']}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <ActivityIndicator size="large" color="#fff" />
                </Animated.View>
                <Text style={styles.text}>Завантаження...</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        marginTop: 24,
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
        letterSpacing: 1,
    },
});
