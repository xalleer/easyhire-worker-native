import React, { useEffect, useRef } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    View,
    Animated,
    PanResponder,
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
    const translateY = useRef(new Animated.Value(screenHeight)).current;

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
                    translateY.setValue(screenHeight - height + gesture.dy);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 80) {
                    animateTo(screenHeight, onClose);
                } else {
                    animateTo(screenHeight - height);
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            animateTo(screenHeight - height);
        } else {
            animateTo(screenHeight);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="none">
            <Pressable style={styles.backdrop} onPress={() => animateTo(screenHeight, onClose)} />
            <Animated.View style={[styles.sheet, { top: translateY, height }]}>
                <View {...panResponder.panHandlers}>
                    <View style={styles.dragIndicator} />
                </View>
                {children}
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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