// src/components/support/SupportForm.tsx
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export function SupportForm() {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) {
      Alert.alert("Missing message", "Please write a message before sending.");
      return;
    }

    Alert.alert("Message sent", "Your support message has been received.");
    setMessage("");
  }

  return (
    <View style={{ marginTop: 32 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
        Still need help?
      </Text>

      <TextInput
        placeholder="Write your message here..."
        value={message}
        onChangeText={setMessage}
        multiline
        textAlignVertical="top"
        style={{
          minHeight: 120,
          borderWidth: 1,
          borderColor: "#DADADA",
          padding: 12,
          fontSize: 15,
        }}
      />

      <TouchableOpacity
        onPress={handleSend}
        style={{
          backgroundColor: "#000",
          paddingVertical: 14,
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}