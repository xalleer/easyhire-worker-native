import {View, Text, StyleSheet, Animated} from "react-native";
import colors from "@/theme/colors";
import AvatarUi from "@/components/ui/AvatarUi";
import {useUserStore} from "@/store/userStore";
import {changeStatusApi} from "@/api/user";
import IconStatus from "@/assets/icons/IconStatus";
import typography from "@/theme/typography";
import ToggleUi from "@/components/ui/ToggleUi";
import {useCallback, useEffect} from "react";
import {acceptTaskApi, declineTaskApi, getTasksByCityApi} from "@/api/task";
import { useTaskStore } from "@/store/taskStore";
import {useAuthStore} from "@/store/authStore";
import TaskCard from "@/components/TaskCard";
import LoadingScreen from "@/components/LoadingScreen";
import {useFocusEffect} from "expo-router";
import { useSocket } from '@/hooks/useSocket';
import socket from "@/services/socket";
import ScrollView = Animated.ScrollView;

export default function TasksScreen() {
    const {user, setUser} = useUserStore();
    const { availableTasks, acceptedTask, setAvailableTasks, setAcceptedTask } = useTaskStore();
    const token = useAuthStore((state) => state.token);

    useSocket(user!._id);

    const handleToggleStatus = async (value: boolean) => {
        try {
            const newStatus = value ? 'online' : 'offline';

            console.log('New status:', newStatus);
            const updatedUser = await changeStatusApi({ status: newStatus });
            setUser(updatedUser);

        } catch (error) {
            console.error('Failed to change status:', error);
        }
    };

    const handleAcceptTask = async (taskId: string) => {
        try {
            console.log("Accepting task:", taskId);
            console.log(user?._id);
            if (!user?._id) return;


            const res = await acceptTaskApi(
                taskId,
                user._id
            );

            console.log(res)

            if (res) {
                const updatedTasks = availableTasks.filter((task) => task._id !== taskId);
                setAvailableTasks(updatedTasks);
                setAcceptedTask(res);
            }

            console.log(res);
        } catch (e) {
            console.error("Error accepting task:", e);
        }
    };

    const handleCancelTask = async (taskId: string)  => {
        try {
            if (!user?._id || !user?.cities) return;

            const res = await declineTaskApi(taskId, user._id);

            if (res) {
                setAcceptedTask(null);

                const updatedTasks = await getTasksByCityApi({ city: user.cities[0] });
                setAvailableTasks(updatedTasks);
            }
        } catch (e) {
            console.log(e);
        }
    }



    useFocusEffect(
        useCallback(() => {
            if (!token || !user?.cities) return;

            const fetchTasks = async () => {
                try {
                    const tasks = await getTasksByCityApi({ city: user.cities![0] });
                    console.log(tasks);
                    setAvailableTasks(tasks);
                } catch (error) {
                    console.error("Failed to fetch tasks:", error);
                }
            };

            fetchTasks();
        }, [token, user?.cities])
    );

    useEffect(() => {
        socket.on('newOrder', (data) => {
            console.log('Новий запит:', data);
        });

        return () => {
            socket.off('newOrder');
        };
    }, []);



    return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, justifyContent: 'space-between', width: '100%', borderStyle: 'solid', borderColor: colors.borderColor, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <AvatarUi size={48} name={user?.name}></AvatarUi>
                        <View style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8}}>
                                <Text>{user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ''}</Text>
                                <IconStatus color={user?.status === 'online' ? 'green' : 'red'}></IconStatus>
                            </View>
                            <Text style={[typography.title, { fontSize: 16}]}>{ user?.name }</Text>
                        </View>
                    </View>


                    <ToggleUi onValueChange={handleToggleStatus}
                              value={user?.status === 'online'}
                    ></ToggleUi>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>


                {user?.status === 'online' ?
                    <>
                        {acceptedTask && user?.acceptedTask ?
                            <>
                                <Text style={[typography.title, { alignSelf: 'flex-start', marginTop: 16, marginBottom: 16, fontSize: 16}]}> Accepted Task</Text>
                                <TaskCard task={acceptedTask} onCancel={() => handleCancelTask(acceptedTask!._id)}/>
                            </>

                            : null
                        }


                        {availableTasks.length ?
                            <>

                                <Text style={[typography.title, { alignSelf: 'flex-start', marginTop: 16, marginBottom: 16, fontSize: 16}]}> Available Tasks</Text>


                                <View style={{gap: 24}}>
                                    {availableTasks.map((task) => (
                                        <TaskCard onAccept={() => handleAcceptTask(task._id)} key={task._id} task={task} />
                                    ))}
                                </View>


                            </>

                            : null
                        }
                    </>

                    :

                    <Text>Ви знаходитесь offline</Text>
                }

                </ScrollView>






            </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.background,
    },



});