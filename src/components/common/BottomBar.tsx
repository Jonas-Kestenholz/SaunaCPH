import { Pressable, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../features/cart/hooks";

import { CartIcon } from "../icons/CartIcon";
import { NotificationIcon } from "../icons/NotificationIcon";
import { ProfileIcon } from "../icons/ProfileIcon";
import { SaunaLogoIcon } from "../icons/SaunaLogoIcon";
import { SupportIcon } from "../icons/SupportIcon";

import { useRestockAlerts } from "../../features/notifications/hooks";
import { useCustomerProfile } from "../../features/profile/hooks";

function BottomBarButton({
  children,
  onPress,
  isCenter = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  isCenter?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: isCenter ? 1.35 : 1,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.55 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}


export default function BottomBar() {
  const { data: cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const { data: alerts = [] } = useRestockAlerts();
  const { data } = useCustomerProfile();

  const isLoggedIn = !!data;
  const hasNotifications = alerts.length > 0;

  const isSupportActive = pathname.startsWith("/support");
  const isNotificationsActive = pathname.startsWith("/notifications");
  const isCartActive = pathname.startsWith("/cart");
  const isProfileActive = pathname.startsWith("/profile");
  const isHomeActive = pathname === "/";
  const cartItemCount =
  cart?.lines?.reduce((total, line) => total + (line.quantity ?? 0), 0) ?? 0;

  const barHeight = 50 + insets.bottom;

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
        borderTopColor: "rgba(0,0,0,0.12)",
        paddingHorizontal: 20,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          width: 104,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 28,
        }}
      >
        <Pressable
          onPress={() => router.push("/support")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.55 : 1,
          })}
        >
          <SupportIcon size={39} filled={isSupportActive} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/notifications")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.55 : 1,
          })}
        >
          <NotificationIcon
            size={39}
            filled={isNotificationsActive}
            hasNotification={hasNotifications}
          />
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push("/")}
        style={({ pressed }) => ({
          opacity: pressed ? 0.55 : 1,
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <View style={{ transform: [{ translateY: 2 }] }}>
          <SaunaLogoIcon width={68} height={30} />
        </View>
      </Pressable>

      <View
        style={{
          width: 104,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 28,
        }}
      >
        <Pressable
          onPress={() => router.push("/cart")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.55 : 1,
          })}
        >
          <CartIcon size={38} filled={isCartActive} hasNotification={cartItemCount > 0} />
        </Pressable>

        <Pressable
          onPress={() => {
            router.push(isLoggedIn ? "/profile" : "/login");
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.55 : 1,
          })}
        >
          <View style={{ transform: [{ translateY: -1 }] }}>
            <ProfileIcon size={42} filled={isProfileActive} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
