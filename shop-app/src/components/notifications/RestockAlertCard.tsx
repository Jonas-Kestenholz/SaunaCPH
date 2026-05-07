import { Image, Text, TouchableOpacity, View } from "react-native";
import type { RestockAlert } from "../../features/notifications/types";

type Props = {
  alert: RestockAlert;
  onRemove: () => void;
};

export function RestockAlertCard({ alert, onRemove }: Props) {
  return (
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

        <Text style={{ color: "#666", marginTop: 8 }}>
          You’ll be notified when this item is back in stock.
        </Text>

        <TouchableOpacity onPress={onRemove} style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: "800", textDecorationLine: "underline" }}>
            Remove alert
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}