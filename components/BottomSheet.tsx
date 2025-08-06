import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number;
}

export default function BottomSheet({
                                        visible,
                                        onClose,
                                        children,
                                        height = 350,
                                    }: BottomSheetProps) {
    const translateY = useRef(new Animated.Value(height)).current;
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    const animateTo = (toValue: number, callback?: () => void) => {
        Animated.timing(translateY, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start(() => callback?.());
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 10,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    translateY.setValue(gesture.dy);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 80) {
                    animateTo(height, onClose);
                } else {
                    animateTo(0);
                }
            },
        })
    ).current;

    useEffect(() => {
        const keyboardWillShow = (event: any) => {
            Animated.timing(keyboardHeight, {
                toValue: event.endCoordinates.height,
                duration: event.duration || 250,
                useNativeDriver: false,
            }).start();
        };

        const keyboardWillHide = () => {
            Animated.timing(keyboardHeight, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        };

        const showListener = Platform.OS === 'ios' 
            ? Keyboard.addListener('keyboardWillShow', keyboardWillShow)
            : Keyboard.addListener('keyboardDidShow', keyboardWillShow);
        
        const hideListener = Platform.OS === 'ios'
            ? Keyboard.addListener('keyboardWillHide', keyboardWillHide)
            : Keyboard.addListener('keyboardDidHide', keyboardWillHide);

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (visible) {
            animateTo(0); // Показуємо модалку (0 = видимо)
        } else {
            animateTo(height); // Ховаємо модалку (height = приховано)
        }
    }, [visible, height]);

    // Обчислюємо позицію з урахуванням клавіатури
    const animatedStyle = {
        bottom: keyboardHeight,
        transform: [{
            translateY: translateY
        }]
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Pressable 
                    style={styles.backdrop} 
                    onPress={() => {
                        Keyboard.dismiss();
                        animateTo(height, onClose);
                    }} 
                />
                <Animated.View style={[styles.sheet, { height }, animatedStyle]}>
                    <View {...panResponder.panHandlers}>
                        <View style={styles.dragIndicator} />
                    </View>
                    {children}
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#ccc",
        alignSelf: "center",
        marginBottom: 12,
    },
});