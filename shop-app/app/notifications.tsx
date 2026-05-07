import { ScrollView, Text, View } from "react-native";
import { RestockAlertCard } from "../src/components/notifications/RestockAlertCard";
import {
  useRemoveRestockAlert,
  useRestockAlerts,
} from "../src/features/notifications/hooks";

export default function NotificationsScreen() {
  const { data: alerts = [], isLoading } = useRestockAlerts();
  const removeAlert = useRemoveRestockAlert();

  if (isLoading) {
    return <Text style={{ padding: 20 }}>Loading notifications...</Text>;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
    >
      <Text style={{ fontSize: 34, fontWeight: "900" }}>
        NOTIFICATIONS
      </Text>

      <Text style={{ color: "#666", marginTop: 6, marginBottom: 24 }}>
        Restock alerts and product updates.
      </Text>

      {alerts.length === 0 ? (
        <View
          style={{
            backgroundColor: "#F2F2F2",
            padding: 18,
            marginTop: 12,
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 18 }}>
            No active alerts
          </Text>
          <Text style={{ color: "#666", marginTop: 8 }}>
            Restock alerts will appear here when you subscribe to an
            unavailable product.
          </Text>
        </View>
      ) : (
        alerts.map((alert) => (
          <RestockAlertCard
            key={alert.id}
            alert={alert}
            onRemove={() => removeAlert.mutate(alert.id)}
          />
        ))
      )}
    </ScrollView>
  );
}