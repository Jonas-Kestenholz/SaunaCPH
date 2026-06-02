import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import BackButton from "../src/components/common/BackButton";
import { CurrentOrderCard } from "../src/components/profile/CurrentOrderCard";
import { useCustomerProfile } from "../src/features/profile/hooks";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function OrdersScreen() {
  const { data, isLoading, error } = useCustomerProfile();

  if (isLoading) {
    return <LoadingScreen label="Loading orders..." backgroundColor="#f1f1f1" />;
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
          Orders unavailable
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
          Sign in to view your order history.
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
        Orders
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
        View your recent order history and shipping updates.
      </Text>

      {data.orders.length > 0 ? (
        <View style={{ gap: 14 }}>
          {data.orders.map((order) => (
            <CurrentOrderCard key={order.id} order={order} />
          ))}
        </View>
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
            No orders yet
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
            Your order history will appear here when you place your first order.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}