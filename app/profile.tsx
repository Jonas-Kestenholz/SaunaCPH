import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { CurrentOrderCard } from "../src/components/profile/CurrentOrderCard";
import { ProfileMenuItem } from "../src/components/profile/ProfileMenuItem";
import { useCustomerProfile } from "../src/features/profile/hooks";
import { clearCustomerAccessToken } from "../src/features/auth/storage";
import LoadingScreen from "@/src/components/common/LoadingScreen";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 20,
        lineHeight: 24,
        fontFamily: "BarlowCondensed-SemiBold",
        textTransform: "uppercase",
        color: "#111",
        marginBottom: 10,
      }}
    >
      {children}
    </Text>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 13,
        lineHeight: 20,
        fontFamily: "Inter_18pt-Regular",
        color: "#666",
      }}
    >
      {children}
    </Text>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View
      style={{
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: "#ececec",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          lineHeight: 18,
          fontFamily: "Inter_18pt-Regular",
          color: "#777",
          marginBottom: 2,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: "Inter_18pt-Regular",
          color: "#111",
        }}
      >
        {value || "-"}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useCustomerProfile();

  async function handleLogout() {
    await clearCustomerAccessToken();
    queryClient.clear();
    router.replace("/login");
  }

  if (isLoading) {
    return <LoadingScreen label="Loading profile..." backgroundColor="#f1f1f1" />;
  }

  if (error || !data) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 34,
            lineHeight: 36,
            fontFamily: "BarlowCondensed-SemiBold",
            textTransform: "uppercase",
            color: "#111",
            marginBottom: 8,
          }}
        >
          Sign in required
        </Text>

        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
            marginBottom: 24,
          }}
        >
          Sign in to view your profile, orders and account settings.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={{
            height: 52,
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#111",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "BarlowCondensed-SemiBold",
              fontSize: 16,
              lineHeight: 18,
              textTransform: "uppercase",
            }}
          >
            Go to login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 70,
        paddingBottom: 140,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontSize: 34,
          lineHeight: 36,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        What's up
      </Text>

      <Text
        style={{
          marginTop: 2,
          fontSize: 24,
          lineHeight: 28,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        {data.firstName ?? data.displayName}
      </Text>

      {data.email ? (
        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            lineHeight: 19,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          {data.email}
        </Text>
      ) : null}

      <View style={{ marginTop: 28 }}>
        <SectionTitle>Shipping status</SectionTitle>

        {data.latestOrder ? (
          <CurrentOrderCard order={data.latestOrder} />
        ) : (
          <View
            style={{
              backgroundColor: "#f3f3f3",
              paddingHorizontal: 16,
              paddingVertical: 18,
              borderWidth: 1,
              borderColor: "#ececec",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                lineHeight: 24,
                fontFamily: "BarlowCondensed-SemiBold",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              No active shipment
            </Text>

            <Text
              style={{
                fontSize: 13,
                lineHeight: 20,
                fontFamily: "Inter_18pt-Regular",
                color: "#666",
                marginTop: 8,
              }}
            >
              Your latest shipping status will appear here when you place an
              order.
            </Text>
          </View>
        )}
      </View>

      <View
        style={{
          marginTop: 30,
          borderTopWidth: 1,
          borderTopColor: "#ececec",
        }}
      >
        <ProfileMenuItem
          label="ORDERS"
          onPress={() => router.push("/orders")}
        />

        <ProfileMenuItem
          label="PROFILE"
          onPress={() => router.push("/profile-details")}
        />

        <ProfileMenuItem
          label="APP SETTINGS"
          onPress={() => router.push("/app-settings")}
        />
      </View>

      

      <View style={{ marginTop: 28 }}>
        <View
          style={{
            paddingHorizontal: 0,
            paddingVertical: 18,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              lineHeight: 24,
              fontFamily: "BarlowCondensed-SemiBold",
              textTransform: "uppercase",
              color: "#111",
            }}
          >
            Shopify customer account
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
              marginTop: 8,
            }}
          >
            Your account login is handled securely through Shopify Customer
            Accounts.
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              marginTop: 24,
              height: 52,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#111",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#111",
                fontFamily: "BarlowCondensed-SemiBold",
                fontSize: 16,
                lineHeight: 18,
                textTransform: "uppercase",
              }}
            >
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
