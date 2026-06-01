import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { CartIcon } from "../icons/CartIcon";
import { NotificationIcon } from "../icons/NotificationIcon";
import { useRestockAlerts } from "../../features/notifications/hooks";
import { ProfileIcon } from "../icons/ProfileIcon";
import { useCustomerProfile } from "../../features/profile/hooks";
import { SaunaLogoIcon } from "../icons/SaunaLogoIcon";

export default function BottomBar() {
  const router = useRouter();
  const { data: alerts = [] } = useRestockAlerts();
  const { data } = useCustomerProfile();
  const isLoggedIn = !!data;

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
      <Pressable onPress={() => router.push("/support")}>
        <Text style={{ fontSize: 24 }}>?</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/notifications")}>
        <NotificationIcon filled={alerts.length > 0} />
      </Pressable>

      <Pressable onPress={() => router.push("/")}>
      <SaunaLogoIcon />
      </Pressable>

      <Pressable onPress={() => router.push("/cart")}>
        <CartIcon />
      </Pressable>

      <Pressable onPress={() => router.push("/profile")}>
          <ProfileIcon filled={isLoggedIn} />
      </Pressable>
    </View>
  );
}
