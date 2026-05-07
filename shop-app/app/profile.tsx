import { CurrentOrderCard } from "../src/components/profile/CurrentOrderCard";
import { ProfileMenuItem } from "../src/components/profile/ProfileMenuItem";
import { useCustomerProfile } from "../src/features/profile/hooks";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { clearCustomerAccessToken } from "../src/features/auth/storage";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useCustomerProfile();

  async function handleLogout() {
    await clearCustomerAccessToken();
    queryClient.clear();
    router.replace("/login");
  }

  if (isLoading) {
    return <Text style={{ padding: 20 }}>Loading profile...</Text>;
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "900", marginBottom: 12 }}>
          SIGN IN REQUIRED
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={{
            backgroundColor: "#000",
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>
            GO TO LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
    >
      <Text style={{ fontSize: 34, fontWeight: "900" }}>WHAT'S UP</Text>
      <Text style={{ fontSize: 24 }}>{data.firstName ?? data.displayName}</Text>
      <Text style={{ marginTop: 4, color: "#666" }}>{data.email}</Text>

      {data.latestOrder && <CurrentOrderCard order={data.latestOrder} />}

      <View style={{ marginTop: 22 }}>
        <ProfileMenuItem label="ORDERS" />
        <ProfileMenuItem label="PROFILE" />
        <ProfileMenuItem label="APP SETTINGS" />
        <ProfileMenuItem label="ACCOUNT & SECURITY" />
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 32,
          borderWidth: 1,
          borderColor: "#000",
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "900" }}>LOG OUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
