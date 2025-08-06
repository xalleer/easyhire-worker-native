import { acceptTaskApi, declineTaskApi, getTaskByIdApi, getTasksByCityApi } from "@/api/task";
import { changeStatusApi, getMeApi } from "@/api/user";
import IconStatus from "@/assets/icons/IconStatus";
import TaskCard from "@/components/TaskCard";
import AvatarUi from "@/components/ui/AvatarUi";
import ButtonUi from "@/components/ui/ButtonUi";
import ToggleUi from "@/components/ui/ToggleUi";
import { useSocket } from '@/hooks/useSocket';
import socket from "@/services/socket";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import { useUserStore } from "@/store/userStore";
import colors from "@/theme/colors";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, LayoutAnimation, Platform, RefreshControl, StyleSheet, Text, UIManager, View } from "react-native";
import ScrollView = Animated.ScrollView;

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TasksScreen() {
    const { user, setUser } = useUserStore();
    const { availableTasks, acceptedTask, setAvailableTasks, setAcceptedTask } = useTaskStore();
    const token = useAuthStore((state) => state.token);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [acceptedTaskLoading, setAcceptedTaskLoading] = useState(false);
    const [acceptedTaskError, setAcceptedTaskError] = useState<null | string>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const statusScaleAnim = useRef(new Animated.Value(1)).current;

    useSocket(user!._id);

    const refreshUserData = async () => {
        try {
            const updatedUser = await getMeApi();
            setUser(updatedUser);
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const fetchTasks = async (showLoader = false) => {
        if (!token || !user?.cities) return;

        try {
            if (showLoader) setLoading(true);
            setError(null);
            const tasks = await getTasksByCityApi({ city: user.cities[0] });
            LayoutAnimation.configureNext(
                LayoutAnimation.create(
                    300,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity
                )
            );
            setAvailableTasks(tasks);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            setError("Failed to load tasks. Please try again.");
            Alert.alert('Помилка', 'Не вдалося завантажити завдання');
        } finally {
            if (showLoader) setLoading(false);
        }
    };
    

    const fetchAcceptedTask = async (taskId: string) => {
        try {
            setAcceptedTaskLoading(true);
            setAcceptedTaskError(null);
            const task = await getTaskByIdApi(taskId);
            LayoutAnimation.configureNext(
                LayoutAnimation.create(
                    300,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity
                )
            );
            setAcceptedTask(task);
        } catch (error) {
            console.error("Error fetching accepted task:", error);
            setAcceptedTaskError("Failed to load accepted task details. Please try again.");
            Alert.alert('Помилка', 'Не вдалося завантажити прийняте завдання');
        } finally {
            setAcceptedTaskLoading(false);
        }
    };

    useEffect(() => {
        if (!acceptedTask && user?.acceptedTask) {
            fetchAcceptedTask(user.acceptedTask);
        }
    }, [user?.acceptedTask]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refreshUserData();
            await fetchTasks();
            if (user?.acceptedTask) {
                await fetchAcceptedTask(user.acceptedTask);
            }
            Animated.sequence([
                Animated.timing(statusScaleAnim, {
                    toValue: 1.05,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(statusScaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } finally {
            setRefreshing(false);
        }
    }, [user?.acceptedTask]);

    useFocusEffect(
        useCallback(() => {
            fetchTasks(true);
            if (user?.acceptedTask) {
                fetchAcceptedTask(user.acceptedTask);
            }
        }, [token, user?.cities, user?.acceptedTask])
    );

    const handleToggleStatus = async (value: boolean) => {
        try {
            await refreshUserData();
            const newStatus = value ? 'online' : 'offline';
            const updatedUser = await changeStatusApi({ status: newStatus });
            LayoutAnimation.configureNext(
                LayoutAnimation.create(
                    300,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity
                )
            );
            setUser(updatedUser);
        } catch (error) {
            console.error('Failed to change status:', error);
            Alert.alert('Помилка', 'Не вдалося змінити статус');
        }
    };

    const handleAcceptTask = async (taskId: string) => {
        try {
            if (!user?._id) return;
            if (user.acceptedTask) {
                Alert.alert('Помилка', 'Ви вже маєте прийняте завдання!');
                return;
            }

            const res = await acceptTaskApi(taskId, user._id);
            if (res) {
                LayoutAnimation.configureNext(
                    LayoutAnimation.create(
                        300,
                        LayoutAnimation.Types.easeInEaseOut,
                        LayoutAnimation.Properties.opacity
                    )
                );
                const updatedTasks = availableTasks.filter((task) => task._id !== taskId);
                setAvailableTasks(updatedTasks);
                setAcceptedTask(res);
                await refreshUserData();
            }
        } catch (error) {
            console.error("Error accepting task:", error);
            Alert.alert('Помилка', 'Не вдалося прийняти завдання');
        }
    };

    const handleCancelTask = async (taskId: string) => {
        try {
            if (!user?._id || !user?.cities) return;
            const res = await declineTaskApi(taskId, user._id);
            if (res) {
                LayoutAnimation.configureNext(
                    LayoutAnimation.create(
                        300,
                        LayoutAnimation.Types.easeInEaseOut,
                        LayoutAnimation.Properties.opacity
                    )
                );
                setAcceptedTask(null);
                const updatedTasks = await getTasksByCityApi({ city: user.cities[0] });
                setAvailableTasks(updatedTasks);
                await refreshUserData();
            }
        } catch (error) {
            console.error("Error canceling task:", error);
            Alert.alert('Помилка', 'Не вдалося скасувати завдання');
        }
    };

    useEffect(() => {
        socket.on('newOrder', (data) => {
            console.log('Новий запит:', data);
            fetchTasks();
        });

        return () => {
            socket.off('newOrder');
        };
    }, []);

    

    // Memoize task list to prevent unnecessary re-renders
    const renderTasks = useMemo(() => (
        <>
            {availableTasks.length > 0 && (
                <Animated.View
                    style={{
                        ...styles.taskGroup,
                        opacity: fadeAnim,
                        transform: [{
                            translateY: slideAnim.interpolate({
                                inputRange: [0, 50],
                                outputRange: [0, 30],
                            }),
                        }],
                    }}
                >
                    <Text style={styles.sectionTitle}>Доступні завдання</Text>
                    <View style={styles.tasksList}>
                        {availableTasks.map((task, index) => (
                            <Animated.View
                                key={task._id}
                                style={{
                                    ...styles.taskItem,
                                    opacity: fadeAnim,
                                    transform: [{
                                        translateX: slideAnim.interpolate({
                                            inputRange: [0, 50],
                                            outputRange: [0, 10 + (index * 5)],
                                        }),
                                    }],
                                }}
                            >
                                <TaskCard
                                    onAccept={() => handleAcceptTask(task._id)}
                                    task={task}
                                />
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>
            )}
        </>
    ), [availableTasks, fadeAnim, slideAnim]);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.lightGreen]}
                        tintColor={colors.lightGreen}
                        title="Оновлення завдань..."
                        titleColor={colors.lightGreen}
                    />
                }
            >
                <Animated.View
                    style={{
                        ...styles.statusCard,
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: statusScaleAnim },
                        ],
                    }}
                >
                    <View style={styles.statusHeader}>
                        <View style={styles.userInfo}>
                            <AvatarUi size={48} name={user?.name} />
                            <View style={styles.userDetails}>
                                <View style={styles.statusRow}>
                                    <Text style={styles.statusText}>
                                        {user?.status
                                            ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                                            : ''}
                                    </Text>
                                    <IconStatus color={user?.status === 'online' ? 'green' : 'red'} />
                                </View>
                                <Text style={styles.userName}>{user?.name}</Text>
                            </View>
                        </View>
                        <ToggleUi
                            onValueChange={handleToggleStatus}
                            value={user?.status === 'online'}
                        />
                    </View>
                </Animated.View>

                <Animated.View
                    style={{
                        ...styles.tasksSection,
                        opacity: fadeAnim,
                        transform: [{
                            translateY: slideAnim.interpolate({
                                inputRange: [0, 50],
                                outputRange: [0, 30],
                            }),
                        }],
                    }}
                >
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <ButtonUi
                                title="Повторити"
                                variant="outline"
                                onPress={() => fetchTasks(true)}
                                style={styles.retryButton}
                            />
                        </View>
                    )}

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Завантаження завдань...</Text>
                        </View>
                    ) : user?.status === 'online' ? (
                        <>
                            {acceptedTaskError && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{acceptedTaskError}</Text>
                                    <ButtonUi
                                        title="Повторити"
                                        variant="outline"
                                        onPress={() => user?.acceptedTask && fetchAcceptedTask(user.acceptedTask)}
                                        style={styles.retryButton}
                                    />
                                </View>
                            )}

                            {acceptedTaskLoading ? (
                                <View style={styles.loadingContainer}>
                                    <Text style={styles.loadingText}>Завантаження прийнятого завдання...</Text>
                                </View>
                            ) : acceptedTask && user?.acceptedTask ? (
                                <Animated.View
                                    style={{
                                        ...styles.taskGroup,
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateY: slideAnim.interpolate({
                                                inputRange: [0, 50],
                                                outputRange: [0, 20],
                                            }),
                                        }],
                                    }}
                                >
                                    <Text style={styles.sectionTitle}>Прийняте завдання</Text>
                                    <TaskCard
                                        task={acceptedTask}
                                        onCancel={() => handleCancelTask(acceptedTask._id)}
                                    />
                                </Animated.View>
                            ) : null}

                            {renderTasks}

                            {availableTasks.length === 0 && !acceptedTask && !acceptedTaskLoading && !acceptedTaskError && (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>Завдань поки немає</Text>
                                    <Text style={styles.emptySubtext}>
                                        Потягніть вниз, щоб оновити
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Ви знаходитесь offline</Text>
                            <Text style={styles.emptySubtext}>
                                Увімкніть статус онлайн, щоб бачити завдання
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingTop: 16,
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    statusCard: {
        width: '100%',
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    userDetails: {
        flexDirection: 'column',
        gap: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        fontSize: 14,
        color: colors.noteColor,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    tasksSection: {
        width: '100%',
        gap: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 12,
    },
    taskGroup: {
        width: '100%',
        gap: 12,
        marginBottom: 20,
    },
    tasksList: {
        gap: 12,
        width: '100%',
    },
    taskItem: {
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 16,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
    },
    retryButton: {
        minWidth: 120,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: colors.noteColor,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 8,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.noteColor,
        textAlign: 'center',
    },
});