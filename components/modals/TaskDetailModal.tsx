import { StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ButtonUi from "@/components/ui/ButtonUi";
import typography from "@/theme/typography";
import BottomSheet from "@/components/BottomSheet";
import { Task } from "@/models/task.model";

interface Props {
    task: Task;
    visible: boolean;
    onClose: () => void;
    onAccept?: () => Promise<void>;
    onCancel?: () => Promise<void>;
}

export default function TaskDetailModal({ task, visible, onClose, onAccept, onCancel }: Props) {
    return (
        <BottomSheet visible={visible} onClose={onClose} height={520}>
            <Text style={[typography.title, styles.header]}>{task.title}</Text>

            <View style={styles.infoRow}>
                <FontAwesome name="info-circle" size={18} color="#555" />
                <Text style={typography.subtitle}>{task.description}</Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="tags" size={18} color="#555" />
                <Text style={typography.subtitle}>{task.category}</Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="map-marker" size={18} color="#555" />
                <Text style={typography.subtitle}>{task.location ?? "No location"}</Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="calendar" size={18} color="#555" />
                <Text style={typography.subtitle}>{new Date(task.startDate).toLocaleString()}</Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="credit-card" size={18} color="#555" />
                <Text style={typography.subtitle}>
                    {task.paymentMethod === "cash" ? "Cash" : "Card"}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="users" size={18} color="#555" />
                <Text style={typography.subtitle}>Workers needed: {task.workersCount}</Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="truck" size={18} color="#555" />
                <Text style={typography.subtitle}>
                    {task.employerProvidesTransport ? "Transport provided" : "No transport"}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="check-circle" size={18} color="#555" />
                <Text style={typography.subtitle}>Status: {task.status}</Text>
            </View>

            <View style={styles.infoRow}>
                <FontAwesome name="credit-card" size={18} color="#555" />
                <Text style={[typography.title]}>{task.price} UAH</Text>
            </View>

            <View style={styles.buttonRow}>
                {onAccept && (
                    <ButtonUi
                        style={{ flex: 1 }}
                        title="Accept"
                        onPress={onAccept}
                        variant="outline"
                    />
                )}
                {onCancel && (
                    <ButtonUi
                        style={{ flex: 1 }}
                        title="Cancel"
                        onPress={onCancel}
                        variant="clear"
                    />
                )}
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
});