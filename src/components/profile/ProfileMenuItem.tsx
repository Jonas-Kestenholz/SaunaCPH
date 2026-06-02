import { Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
};

export function ProfileMenuItem({ label, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        minHeight: 52,
        borderBottomWidth: 1,
        borderBottomColor: "#ececec",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        {label}
      </Text>

      <Text
        style={{
          fontSize: 22,
          lineHeight: 22,
          fontFamily: "Inter_18pt-Regular",
          color: "#111",
          transform: [{ translateY: -1 }],
        }}
      >
        ›
      </Text>
    </TouchableOpacity>
  );
}