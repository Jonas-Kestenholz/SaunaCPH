import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CartIcon } from "../icons/CartIcon";
import { NotificationIcon } from "../icons/NotificationIcon";
import { ProfileIcon } from "../icons/ProfileIcon";
import { SaunaLogoIcon } from "../icons/SaunaLogoIcon";
import { SupportIcon } from "../icons/SupportIcon";

import { useRestockAlerts } from "../../features/notifications/hooks";
import { useCustomerProfile } from "../../features/profile/hooks";

export default function BottomBar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: alerts = [] } = useRestockAlerts();
  const { data } = useCustomerProfile();

  const isLoggedIn = !!data;
  const barHeight = 64 + insets.bottom;

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
        height: barHeight,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#111",
        paddingHorizontal: 22,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        onPress={() => router.push("/support")}
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
      >
        <SupportIcon size={22} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/notifications")}
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
      >
        <NotificationIcon filled={alerts.length > 0} size={22} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/")}
        style={{ width: 72, height: 44, alignItems: "center", justifyContent: "center" }}
      >
        <SaunaLogoIcon width={52} height={20} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/cart")}
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
      >
        <CartIcon size={22} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/profile")}
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
      >
        <ProfileIcon filled={isLoggedIn} size={22} />
      </Pressable>
    </View>
  );
}