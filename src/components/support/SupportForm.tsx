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
      <Text
        style={{
          fontSize: 22,
          lineHeight: 24,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
          marginBottom: 10,
        }}
      >
        STILL NEED HELP?
      </Text>

      <TextInput
        placeholder="Write your message here..."
        placeholderTextColor="#777"
        value={message}
        onChangeText={setMessage}
        multiline
        textAlignVertical="top"
        style={{
          minHeight: 120,
          borderWidth: 1,
          borderColor: "#ececec",
          paddingHorizontal: 12,
          paddingVertical: 12,
          fontSize: 13,
          lineHeight: 20,
          fontFamily: "Inter_18pt-Regular",
          color: "#111",
        }}
      />

      <TouchableOpacity
        onPress={handleSend}
        style={{
          height: 52,
          backgroundColor: "#111",
          borderWidth: 1,
          borderColor: "#111",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
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
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
}