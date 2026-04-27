import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function BottomBar() {
  const router = useRouter();

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
        height: 82,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#111",
        paddingHorizontal: 22,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable onPress={() => console.log("Support kommer senere")}>
        <Text style={{ fontSize: 24 }}>□</Text>
      </Pressable>

      <Pressable onPress={() => console.log("Notifications kommer senere")}>
        <Text style={{ fontSize: 24 }}>♢</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/")}>
        <Text style={{ fontSize: 26, fontWeight: "900" }}>SAUNA</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/cart")}>
        <Text style={{ fontSize: 24 }}>▢</Text>
      </Pressable>

      <Pressable onPress={() => console.log("Account kommer senere")}>
        <Text style={{ fontSize: 24 }}>○</Text>
      </Pressable>
    </View>
  );
}