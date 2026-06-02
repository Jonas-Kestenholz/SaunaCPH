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
      {({ pressed }) => (
        <View
          style={{
            flexDirection: "row",
            gap: 14,
            paddingBottom: 14,
            marginBottom: 18,
            borderBottomWidth: 1,
            borderBottomColor: "#ececec",
            opacity: pressed ? 0.65 : 1,
          }}
        >
          <View
            style={{
              width: 92,
              height: 108,
              backgroundColor: "#f3f3f3",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {alert.imageUrl ? (
              <Image
                source={{ uri: alert.imageUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
              />
            ) : null}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 18,
                lineHeight: 18,
                fontFamily: "BarlowCondensed-SemiBold",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              {alert.productTitle}
            </Text>

            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                fontFamily: "BarlowCondensed-SemiBold",
                color: "#111",
              }}
            >
              Restock alert
            </Text>

            {alert.variantTitle ? (
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  lineHeight: 18,
                  fontFamily: "Inter_18pt-Regular",
                  color: "#666",
                }}
              >
                Size: {alert.variantTitle}
              </Text>
            ) : null}

            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={(event) => {
                  event.stopPropagation();
                  onRemove();
                }}
                style={{
                  height: 32,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 16,
                    fontFamily: "Inter_18pt-Regular",
                    color: "#111",
                    textDecorationLine: "underline",
                  }}
                >
                  REMOVE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}