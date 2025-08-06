import { StyleSheet, Text, View } from "react-native";
import IconCreditCard from "@/assets/icons/IconCreditCard";
import { Image } from "expo-image";
import AvatarUi from "@/components/ui/AvatarUi";
import typography from "@/theme/typography";
import IconStarSecondary from "@/assets/icons/IconStarSecondary";
import ButtonUi from "@/components/ui/ButtonUi";
import colors from "@/theme/colors";
import { Task } from "@/models/task.model";
import { useState } from "react";

import TaskDetailModal from "@/components/modals/TaskDetailModal";

type Props = {
    task: Task;
    onAccept?: () => Promise<void>;
    onCancel?: () => Promise<void>;
};

export default function TaskCard({ task, onAccept, onCancel }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
                <View style={styles.card}>
                    <View style={styles.chip}>
                        <IconCreditCard />
                        <Text>{task.price}</Text>
                        <Image
                            style={{ width: 16, height: 16 }}
                            source={require("../assets/icons/icon-uah.png")}
                        />
                    </View>
                    <View style={styles.cardHeader}>
                        <AvatarUi size={48} name={task.employer.name} />
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: 4,
                                justifyContent: "center",
                            }}
                        >
                            <Text style={[typography.title, { fontSize: 16 }]}>
                                {task.employer.name}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 4,
                                    justifyContent: "center",
                                }}
                            >
                                <IconStarSecondary />
                                <Text>{task.employer.rating.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <Text style={typography.title}>{task.title}</Text>
                        <Text style={[typography.subtitle, { width: "80%" }]}>
                            {task.description}
                        </Text>
                    </View>

                    <View style={styles.cardFooter}>
                        {onAccept ? (
                            <ButtonUi
                                style={{ width: "50%" }}
                                title={"Accept"}
                                variant={"outline"}
                                onPress={onAccept}
                            />
                        ) : null}
                        {onCancel ? (
                            <ButtonUi
                                style={{ width: "50%" }}
                                title={"Cancel"}
                                variant={"outline"}
                                onPress={onCancel}
                            />
                        ) : null}
                        <ButtonUi
                            style={{ width: "50%" }}
                            title={"View Detail"}
                            variant={"clear"}
                            onPress={() => setOpen(true)}
                        />
                    </View>
                </View>

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
    chip: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        right: 16,
        top: 16,
        borderStyle: "solid",
        borderColor: colors.black,
        borderWidth: 1,
        backgroundColor: colors.chipPrimary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    card: {
        borderStyle: "solid",
        borderColor: colors.borderColor,
        borderWidth: 1,
        padding: 16,
        borderRadius: 16,
        width: "100%",
        gap: 8,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    cardContent: {
        marginVertical: 16,
    },
    cardFooter: {
        paddingTop: 16,
        paddingBottom: 8,
        borderStyle: "solid",
        borderColor: colors.borderColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
});