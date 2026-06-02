import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { RestockAlertCard } from "../src/components/notifications/RestockAlertCard";
import {
  useRemoveRestockAlert,
  useRestockAlerts,
} from "../src/features/notifications/hooks";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function NotificationsScreen() {
  const { data: alerts = [], isLoading } = useRestockAlerts();
  const removeAlert = useRemoveRestockAlert();

  if (isLoading) {
    return <LoadingScreen label="Loading notifications..." backgroundColor="#f1f1f1" />;
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 70,
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontSize: 34,
          lineHeight: 36,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        Notifications
      </Text>

      <Text
        style={{
          fontSize: 13,
          lineHeight: 19,
          fontFamily: "Inter_18pt-Regular",
          color: "#666",
          marginTop: 6,
          marginBottom: 24,
        }}
      >
        Restock alerts and product updates.
      </Text>
      

      {alerts.length === 0 ? (
        <View
          style={{
            backgroundColor: "#f3f3f3",
            paddingHorizontal: 16,
            paddingVertical: 18,
            borderWidth: 1,
            borderColor: "#ececec",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              lineHeight: 24,
              fontFamily: "BarlowCondensed-SemiBold",
              textTransform: "uppercase",
              color: "#111",
            }}
          >
            No active alerts
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
              marginTop: 8,
            }}
          >
            Restock alerts will appear here when you subscribe to an unavailable
            product.
          </Text>
        </View>
      ) : (
        <View>
          {alerts.map((alert) => (
            <RestockAlertCard
              key={alert.id}
              alert={alert}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: alert.productId },
                })
              }
              onRemove={() => removeAlert.mutate(alert.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
