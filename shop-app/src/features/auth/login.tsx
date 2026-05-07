import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useLogin } from "./hooks";

export default function LoginScreen() {
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    try {
      await login.mutateAsync({
        email: email.trim(),
        password,
      });

      router.replace("/profile");
    } catch (error) {
      Alert.alert(
        "Login failed",
        error instanceof Error ? error.message : "Something went wrong."
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
      <Text style={{ fontSize: 36, fontWeight: "900", marginBottom: 8 }}>
        LOGIN
      </Text>

      <Text style={{ color: "#666", marginBottom: 28 }}>
        Sign in to view your profile and orders.
      </Text>

      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 14,
          marginBottom: 16,
        }}
      />

      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 14,
          marginBottom: 20,
        }}
      />

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
          <Text style={{ color: "#fff", fontWeight: "900" }}>SIGN IN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}