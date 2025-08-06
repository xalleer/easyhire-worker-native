import ButtonUi from "@/components/ui/ButtonUi";
import colors from "@/theme/colors";
import typography from "@/theme/typography";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

interface PaymentModalProps {
  visible: boolean;
  htmlContent: string | null;
  onClose: () => void;
  onNavigationStateChange?: (navState: any) => void;
}

export default function PaymentModal({
  visible,
  htmlContent,
  onClose,
  onNavigationStateChange,
}: PaymentModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={[typography.title, { fontSize: 18 }]}>Payment</Text>
          <ButtonUi onPress={onClose} title="Close" variant="outline" style={styles.closeButton} />
        </View>

        {htmlContent && (
          <WebView
            source={{ html: htmlContent }}
            style={styles.webview}
            onNavigationStateChange={onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            mixedContentMode={"compatibility"}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  closeButton: {
    width: 80,
  },
  webview: {
    flex: 1,
  },
});