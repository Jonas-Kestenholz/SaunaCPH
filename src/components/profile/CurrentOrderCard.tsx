import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { TrackingTimeline } from "./TrackingTimeline";
import type { ProfileOrder } from "../../features/profile/types";

function formatOrderDate(rawDate?: string) {
  if (!rawDate) {
    return undefined;
  }

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return new Intl.DateTimeFormat("da-DK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

type Props = {
  order: ProfileOrder;
};

export function CurrentOrderCard({ order }: Props) {
  const hasTrackingNumber = Boolean(order.trackingNumber);

  const formattedOrderDate = formatOrderDate(
    order.processedAt ?? order.updatedAt,
  );

  if (!hasTrackingNumber) {
    return (
      <View
        style={{
          backgroundColor: "#f3f3f3",
          borderWidth: 1,
          borderColor: "#ececec",
          paddingHorizontal: 16,
          paddingVertical: 18,
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
          Order received
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 19,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          Order: {order.name}
        </Text>

        {formattedOrderDate ? (
          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              lineHeight: 19,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
            }}
          >
            Date: {formattedOrderDate}
          </Text>
        ) : null}
        {order.totalPrice ? (
          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              lineHeight: 19,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
            }}
          >
            Total: {order.totalPrice}
          </Text>
        ) : null}

        {order.lineItems?.length ? (
          <View
            style={{
              marginTop: 14,
              borderTopWidth: 1,
              borderTopColor: "#e2e2e2",
              paddingTop: 12,
              gap: 8,
            }}
          >
            {order.lineItems.slice(0, 3).map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontSize: 13,
                    lineHeight: 19,
                    fontFamily: "Inter_18pt-Regular",
                    color: "#111",
                  }}
                >
                  {item.quantity} × {item.title}
                  {item.variantTitle ? ` / ${item.variantTitle}` : ""}
                </Text>

                {item.price ? (
                  <Text
                    style={{
                      fontSize: 13,
                      lineHeight: 19,
                      fontFamily: "Inter_18pt-Regular",
                      color: "#666",
                    }}
                  >
                    {item.price}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#f3f3f3",
        borderWidth: 1,
        borderColor: "#ececec",
        paddingHorizontal: 16,
        paddingVertical: 18,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 22,
              lineHeight: 24,
              fontFamily: "BarlowCondensed-SemiBold",
              textTransform: "uppercase",
              color: "#111",
            }}
          >
            Current order status
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              lineHeight: 19,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
            }}
          >
            Tracking: {order.trackingNumber}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/tracking/[orderId]",
              params: { orderId: order.id },
            })
          }
          style={{
            height: 40,
            paddingHorizontal: 14,
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#111",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "BarlowCondensed-SemiBold",
              fontSize: 14,
              lineHeight: 16,
              textTransform: "uppercase",
            }}
          >
            Track order
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: "#e2e2e2",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            lineHeight: 22,
            fontFamily: "BarlowCondensed-SemiBold",
            textTransform: "uppercase",
            color: "#111",
          }}
        >
          {order.status}
        </Text>

        {formattedOrderDate ? (
          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              lineHeight: 18,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
            }}
          >
            {formattedOrderDate}
          </Text>
        ) : null}
      </View>

      <View style={{ marginTop: 18 }}>
        <TrackingTimeline steps={order.steps} />
      </View>
    </View>
  );
}
