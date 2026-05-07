import { Text, TouchableOpacity, View } from "react-native";
import { TrackingTimeline } from "./TrackingTimeline";
import type { ProfileOrder } from "../../features/profile/types";
import { router } from "expo-router";

type Props = {
  order: ProfileOrder;
};

export function CurrentOrderCard({ order }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#F2F2F2",
        padding: 18,
        marginTop: 24,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "800" }}>
            Current order status:
          </Text>

          <Text style={{ fontSize: 15 }}>{order.trackingNumber}</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/tracking/[orderId]",
              params: { orderId: order.id },
            })
          }
          style={{
            backgroundColor: "#000",
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>
            TRACK ORDER
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "700" }}>{order.status}</Text>
        <Text>{order.updatedAt}</Text>
      </View>

      <TrackingTimeline steps={order.steps} />
    </View>
  );
}
