// src/components/support/FAQItem.tsx
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type FAQItemProps = {
  question: string;
  answer: string;
};

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        paddingVertical: 14,
      }}
    >
      <TouchableOpacity
        onPress={() => setIsOpen((prev) => !prev)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600" }}>{question}</Text>
        <Text style={{ fontSize: 20 }}>{isOpen ? "−" : "+"}</Text>
      </TouchableOpacity>

      {isOpen && (
        <Text
          style={{
            marginTop: 10,
            color: "#666",
            lineHeight: 20,
          }}
        >
          {answer}
        </Text>
      )}
    </View>
  );
}