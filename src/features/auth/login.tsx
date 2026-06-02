import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useLogin } from "./hooks";

export default function LoginScreen() {
  const login = useLogin();

  async function handleLogin() {
    try {
      await login.mutateAsync();
      router.replace("/profile");
    } catch (error) {
      Alert.alert(
        "Login failed",
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 36,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          marginBottom: 8,
          color: "#111",
        }}
      >
        LOGIN
      </Text>

      <Text
        style={{
          color: "#666",
          marginBottom: 28,
          fontFamily: "Inter_18pt-Regular",
        }}
      >
        Sign in securely with Shopify to view your profile and orders.
      </Text>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={login.isPending}
        style={{
          backgroundColor: "#000",
          paddingVertical: 16,
          alignItems: "center",
          opacity: login.isPending ? 0.6 : 1,
        }}
      >
        {login.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              color: "#fff",
              fontFamily: "BarlowCondensed-SemiBold",
              fontSize: 16,
              textTransform: "uppercase",
            }}
          >
            SIGN IN WITH SHOPIFY
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}