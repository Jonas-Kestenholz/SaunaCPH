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
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        paddingVertical: 17,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "800" }}>{label}</Text>
      <Text style={{ fontSize: 24 }}>›</Text>
    </TouchableOpacity>
  );
}