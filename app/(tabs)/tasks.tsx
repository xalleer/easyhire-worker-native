import {View, Text, StyleSheet} from "react-native";
import colors from "@/theme/colors";
import AvatarUi from "@/components/ui/AvatarUi";
import {useUserStore} from "@/store/userStore";
import {changeStatusApi} from "@/api/user";
import IconStatus from "@/assets/icons/IconStatus";
import typography from "@/theme/typography";
import ToggleUi from "@/components/ui/ToggleUi";
import {useEffect} from "react";
import {acceptTaskApi, getTasksByCityApi} from "@/api/task";
import { useTaskStore } from "@/store/taskStore";
import {useAuthStore} from "@/store/authStore";
import TaskCard from "@/components/TaskCard";

export default function TasksScreen() {
    const {user, setUser} = useUserStore();
    const { availableTasks, setAvailableTasks, setAcceptedTask } = useTaskStore();
    const token = useAuthStore((state) => state.token);

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


    useEffect(() => {
        if (!token || !user?.cities) return;

        const fetchTasks = async () => {
            try {
                const tasks = await getTasksByCityApi({ city: user.cities![0] });
                setAvailableTasks(tasks);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        };

        fetchTasks();
    }, [token, user?.cities]);

    return (
        <View style={styles.container}>
            <Text style={[typography.title, { alignSelf: 'flex-start', marginBottom: 16, fontSize: 16}]}>You Status</Text>
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
            <Text style={[typography.title, { alignSelf: 'flex-start', marginTop: 16, marginBottom: 16, fontSize: 16}]}> Available Tasks</Text>

            {availableTasks.map((task) => (
                <TaskCard onAccept={() => handleAcceptTask(task._id)} key={task._id} task={task} />
            ))}

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