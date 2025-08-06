import BottomSheet from "@/components/BottomSheet";
import ButtonUi from "@/components/ui/ButtonUi";
import { Task } from "@/models/task.model";
import colors from "@/theme/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface Props {
    task: Task & { status?: string };
    visible: boolean;
    onClose: () => void;
    onAccept?: () => Promise<void>;
    onCancel?: () => Promise<void>;
}

export default function TaskDetailModal({ task, visible, onClose, onAccept, onCancel }: Props) {
    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    // Entry animation
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(20);
        }
    }, [visible]);

    return (
        <BottomSheet visible={visible} onClose={onClose} height={720}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <Text style={styles.header}>{task.title}</Text>

                <View style={styles.infoSection}>
                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 10],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="info-circle" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>{task.description}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 12],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="tags" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>{task.category}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 14],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="map-marker" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>{task.location ?? "No location"}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 16],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="calendar" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>{new Date(task.startDate).toLocaleString('uk-UA')}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 18],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="credit-card" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>
                            {task.paymentMethod === "cash" ? "Cash" : "Card"}
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 20],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="users" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>Workers needed: {task.workersCount}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 22],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="truck" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>
                            {task.employerProvidesTransport ? "Transport provided" : "No transport"}
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 24],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="check-circle" size={18} color={colors.noteColor} />
                        <Text style={styles.infoText}>
                            Status: {task.status
                                ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
                                : "Unknown"}
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.infoRow,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 20],
                                        outputRange: [0, 26],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <FontAwesome name="credit-card" size={18} color={colors.noteColor} />
                        <Text style={styles.priceText}>{task.price} UAH</Text>
                    </Animated.View>
                </View>

                <View style={styles.buttonRow}>
                    {onAccept && (
                        <ButtonUi
                            style={styles.actionButton}
                            title="Accept"
                            variant="outline"
                            onPress={onAccept}
                        />
                    )}
                    {onCancel && (
                        <ButtonUi
                            style={styles.actionButton}
                            title="Cancel"
                            variant="clear"
                            onPress={onCancel}
                        />
                    )}
                </View>
            </Animated.View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        gap: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
    infoSection: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    infoText: {
        fontSize: 16,
        color: colors.noteColor,
        flex: 1,
        lineHeight: 22,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 24,
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
    },
});