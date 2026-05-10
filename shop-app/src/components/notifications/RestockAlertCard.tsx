import { Image, Text, Pressable, TouchableOpacity, View } from "react-native";
import type { RestockAlert } from "../../features/notifications/types";

type Props = {
  alert: RestockAlert;
  onPress?: () => void;
  onRemove: () => void;
};

export function RestockAlertCard({ alert, onPress, onRemove }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          gap: 14,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E5E5",
        }}
      >
        {alert.imageUrl ? (
          <Image
            source={{ uri: alert.imageUrl }}
            style={{ width: 72, height: 92, backgroundColor: "#eee" }}
          />
        ) : (
          <View style={{ width: 72, height: 92, backgroundColor: "#eee" }} />
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "900", fontSize: 16 }}>
            {alert.productTitle}
          </Text>

          {alert.variantTitle && (
            <Text style={{ color: "#666", marginTop: 4 }}>
              {alert.variantTitle}
            </Text>
          )}

          <Text style={{ color: "#666", marginTop: 8, lineHeight: 20 }}>
            You’ll be notified when this item is back in stock.
          </Text>

          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            style={{ marginTop: 12 }}
          >
            <Text style={{ fontWeight: "800", textDecorationLine: "underline" }}>
              Remove alert
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}