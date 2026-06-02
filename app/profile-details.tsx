import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { useCustomerProfile } from "../src/features/profile/hooks";
import BackButton from "@/src/components/common/BackButton";
import LoadingScreen from "@/src/components/common/LoadingScreen";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
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

export default function ProfileDetailsScreen() {
  const { data, isLoading, error } = useCustomerProfile();

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
          Profile unavailable
        </Text>

        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          Sign in to view your profile details.
        </Text>
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
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          width: 44,
          height: 44,
          alignItems: "flex-start",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
       <BackButton />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 34,
          lineHeight: 36,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        Profile
      </Text>

      <Text
        style={{
          fontSize: 13,
          lineHeight: 19,
          fontFamily: "Inter_18pt-Regular",
          color: "#666",
          marginTop: 6,
          marginBottom: 28,
        }}
      >
        Your customer information from Shopify.
      </Text>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#ececec",
        }}
      >
        <InfoRow label="First name" value={data.firstName} />
        <InfoRow label="Last name" value={data.lastName} />
        <InfoRow label="Email" value={data.email} />
        <InfoRow label="Phone" value={data.phone} />
        <InfoRow label="Address" value={data.defaultAddress?.address1} />
        <InfoRow label="City" value={data.defaultAddress?.city} />
        <InfoRow label="Country" value={data.defaultAddress?.country} />
      </View>
    </ScrollView>
  );
}