import { getMeApi } from "@/api/user";
import AccountListItem from "@/components/AccountListItem";
import AvatarUi from "@/components/ui/AvatarUi";
import ButtonUi from "@/components/ui/ButtonUi";
import { getListItems } from "@/constants/accountItems";
import { useLogout } from "@/hooks/useLogout";
import { useUserStore } from "@/store/userStore";
import colors from "@/theme/colors";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AccountScreen() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { user, setUser } = useUserStore();
    const { logout } = useLogout();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const profileScaleAnim = useRef(new Animated.Value(1)).current;

    // Entry animation
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

    const fetchUserData = async (showLoader = false) => {
        try {
            if (showLoader) setLoading(true);
            setError(null);
            const data = await getMeApi();
            setUser(data);
        } catch (err) {
            console.error('Error loading user:', err);
            setError("Failed to load user data. Please try again.");
            Alert.alert('Помилка', 'Не вдалося завантажити дані користувача');
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchUserData();
            Animated.sequence([
                Animated.timing(profileScaleAnim, {
                    toValue: 1.05,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(profileScaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserData(true);
    }, []);

    const listItems = getListItems(logout);

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
                        title="Оновлення профілю..."
                        titleColor={colors.lightGreen}
                    />
                }
            >
                <Animated.View
                    style={[
                        styles.profileCard,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: profileScaleAnim },
                            ],
                        },
                    ]}
                >
                    <AvatarUi name={user?.name} size={128} />
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userDetail}>{user?.phone}</Text>
                    <Text style={styles.userDetail}>{user?.email}</Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.listSection,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 50],
                                    outputRange: [0, 30],
                                }),
                            }],
                        },
                    ]}
                >
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <ButtonUi
                                title="Повторити"
                                variant="outline"
                                onPress={() => fetchUserData(true)}
                                style={styles.retryButton}
                            />
                        </View>
                    )}

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Завантаження даних...</Text>
                        </View>
                    ) : (
                        <View style={styles.list}>
                            {listItems.map((item, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.listItem,
                                        {
                                            opacity: fadeAnim,
                                            transform: [{
                                                translateX: slideAnim.interpolate({
                                                    inputRange: [0, 50],
                                                    outputRange: [0, 10 + (index * 2)],
                                                }),
                                            }],
                                        },
                                    ]}
                                >
                                    <AccountListItem {...item} />
                                </Animated.View>
                            ))}
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
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    profileCard: {
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
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
    userDetail: {
        fontSize: 16,
        color: colors.noteColor,
        textAlign: 'center',
    },
    listSection: {
        width: '100%',
        gap: 20,
    },
    list: {
        gap: 12,
        width: '100%',
    },
    listItem: {
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
});