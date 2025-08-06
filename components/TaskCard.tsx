import IconCreditCard from "@/assets/icons/IconCreditCard";
import IconStarSecondary from "@/assets/icons/IconStarSecondary";
import TaskDetailModal from "@/components/modals/TaskDetailModal";
import AvatarUi from "@/components/ui/AvatarUi";
import ButtonUi from "@/components/ui/ButtonUi";
import { Task } from "@/models/task.model";
import colors from "@/theme/colors";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import * as Progress from 'react-native-progress';

type Props = {
    task: Task & { status?: string }; // Assuming status is optional and can be "pending", "in_progress", or "completed"
    onAccept?: () => Promise<void>;
    onCancel?: () => Promise<void>;
};

export default function TaskCard({ task, onAccept, onCancel }: Props) {
    const [open, setOpen] = useState(false);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    // Entry animation
    useEffect(() => {
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
    }, []);

    const getProgress = () => {
        switch (task.status?.toLowerCase()) {
            case "waiting-for-hiring":
                return 0.3;
            case "in-progress":
                return 0.4;
            case "submitted":
                return 0.8;
            case "completted":
                return 1;
            default:
                return 0.0;
        }
    };

    return (
        <>
            <Animated.View
                style={[
                    styles.card,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View style={styles.chip}>
                    <IconCreditCard />
                    <Text style={styles.chipText}>{task.price}</Text>
                    <Image
                        style={styles.currencyIcon}
                        source={require("../assets/icons/icon-uah.png")}
                    />
                </View>
                <View style={styles.cardHeader}>
                    <AvatarUi size={48} name={task.employer.name} />
                    <View style={styles.employerInfo}>
                        <Text style={styles.employerName}>{task.employer.name}</Text>
                        <View style={styles.ratingRow}>
                            <IconStarSecondary />
                            <Text style={styles.ratingText}>{task.employer.rating.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskDescription}>{task.description}</Text>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressLabel}>
                            {task.status
                                ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
                                : "Unknown"}
                        </Text>
                        <Progress.Bar
  progress={getProgress()}
  width={null} 
  color={colors.lightGreen}
  unfilledColor={colors.borderColor}
  borderWidth={0}
  height={8}
  borderRadius={4}
/>
                    </View>
                </View>

                <View style={styles.cardFooter}>
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
                            variant="outline"
                            onPress={onCancel}
                        />
                    )}
                    <ButtonUi
                        style={styles.actionButton}
                        title="View Detail"
                        variant="clear"
                        onPress={() => setOpen(true)}
                    />
                </View>
            </Animated.View>

            <TaskDetailModal
                task={task}
                visible={open}
                onClose={() => setOpen(false)}
                onAccept={onAccept}
                onCancel={onCancel}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: colors.white,
        shadowColor: '#000',
       
        borderColor: colors.borderColor,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
        gap: 12,
    },
    chip: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        right: 16,
        top: 16,
        backgroundColor: colors.chipPrimary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.black,
    },
    currencyIcon: {
        width: 16,
        height: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    employerInfo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
    },
    employerName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingText: {
        fontSize: 14,
        color: colors.noteColor,
    },
    cardContent: {
        marginVertical: 12,
        gap: 8,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
    },
    taskDescription: {
        fontSize: 14,
        color: colors.noteColor,
        lineHeight: 20,
    },
    progressContainer: {
        marginTop: 8,
        gap: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.noteColor,
    },
    progressBar: {
        width: '100%',
        height: 8,
        borderRadius: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderColor: colors.borderColor,
        gap: 12,
    },
    actionButton: {
        flex: 1,
    },
});