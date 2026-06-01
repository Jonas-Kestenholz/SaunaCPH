import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCustomerProfile } from "../../src/features/profile/hooks";
import { useTrackingDetails } from "../../src/features/tracking/hooks";

export default function TrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const {
    data,
    isLoading: isProfileLoading,
    error: profileError,
  } = useCustomerProfile();

  const order = data?.orders.find((item) => item.id === orderId);

  const {
    data: tracking,
    isLoading: isTrackingLoading,
    error: trackingError,
  } = useTrackingDetails(order);

  if (isProfileLoading || isTrackingLoading) {
    return <Text style={{ padding: 20 }}>Loading tracking...</Text>;
  }

  if (profileError || trackingError || !data || !tracking) {
    return <Text style={{ padding: 20 }}>Could not load tracking.</Text>;
  }

  if (!order) {
    return <Text style={{ padding: 20 }}>Order not found.</Text>;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
    >
      <Text style={{ fontSize: 30, fontWeight: "900", marginBottom: 24 }}>
        TRACK ORDER
      </Text>

      <View
        style={{ backgroundColor: "#F2F2F2", padding: 18, marginBottom: 24 }}
      >
        <Text style={{ fontWeight: "900" }}>Status</Text>

        <Text style={{ marginTop: 8 }}>
          {tracking.trackingNumber ?? "Tracking number pending"}
        </Text>

        <Text style={{ marginTop: 8, fontWeight: "700" }}>
          {tracking.status || "Tracking pending"}
        </Text>

        <Text style={{ color: "#666" }}>
          {tracking.carrier !== "UNKNOWN"
            ? tracking.carrier
            : "Carrier pending"}
        </Text>

        {!tracking.trackingNumber && (
          <Text style={{ color: "#666", marginTop: 12, lineHeight: 20 }}>
            Your order has been received, but tracking information has not been
            added yet.
          </Text>
        )}
      </View>

      <Text style={{ fontSize: 20, fontWeight: "900", marginBottom: 12 }}>
        History
      </Text>

      {tracking.events.length === 0 ? (
        <View style={{ backgroundColor: "#F2F2F2", padding: 18 }}>
          <Text style={{ fontWeight: "900", fontSize: 18 }}>
            Tracking history unavailable
          </Text>
          <Text style={{ color: "#666", marginTop: 8, lineHeight: 20 }}>
            Live DAO/GLS tracking events will appear here when the carrier API
            is connected.
          </Text>
        </View>
      ) : (
        tracking.events.map((event) => (
          <View
            key={event.id}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#E5E5E5",
              paddingVertical: 14,
            }}
          >
            <Text style={{ fontWeight: "900" }}>{event.label}</Text>
            <Text style={{ marginTop: 4 }}>{event.description}</Text>
            {event.timestamp && (
              <Text style={{ color: "#666", marginTop: 4 }}>
                {event.timestamp}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
