// app/support.tsx
import { FAQItem } from "../src/components/support/FAQItem";
import { SupportForm } from "../src/components/support/SupportForm";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const FAQS = [
  {
    question: "How do I return an item?",
    answer:
      "You can return unused items within 14 days of receiving your order. Items must be in original condition with tags attached.",
  },
  {
    question: "Do you offer exchanges?",
    answer:
      "At the moment, exchanges are handled as returns. You can return your item and place a new order in the desired size or color.",
  },
  {
    question: "When will I receive my refund?",
    answer:
      "Refunds are usually processed within 5–10 business days after the return has been received and approved.",
  },
  {
    question: "When will my order ship?",
    answer:
      "Orders are usually processed within 1–3 business days. You will receive tracking information when your order has shipped.",
  },
  {
    question: "How can I cancel my order?",
    answer:
      "If your order has not been shipped yet, you can contact support and request a cancellation.",
  },
  {
    question: "How do I know my order is confirmed?",
    answer:
      "You will receive an order confirmation by email shortly after completing your purchase.",
  },
];

function openNativeMaps() {
  const address = "Løvstræde 1a, Copenhagen, Denmark";

  const encodedAddress = encodeURIComponent(address);

  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?q=${encodedAddress}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  Linking.openURL(url);
}

export default function SupportScreen() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 70,
        paddingBottom: 120,
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
        Support
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
        Find answers to common questions or contact customer support.
      </Text>

      <Text
        style={{
          fontSize: 24,
          lineHeight: 24,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
          marginBottom: 10,
        }}
      >
        Frequently Asked Questions
      </Text>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#ececec",
        }}
      >
        {FAQS.map((item) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </View>

      <View style={{ marginTop: 15 }}>
        <SupportForm />
      </View>

      <View
        style={{
          marginTop: 32,
          borderTopWidth: 1,
          borderTopColor: "#ececec",
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            lineHeight: 24,
            fontFamily: "BarlowCondensed-SemiBold",
            textTransform: "uppercase",
            color: "#111",
            marginBottom: 8,
          }}
        >
          Customer Support Hours
        </Text>

        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          Monday – Friday: 09:00 – 16:00 CET
        </Text>
      </View>

      <View
        style={{
          marginTop: 24,
          borderTopWidth: 1,
          borderTopColor: "#ececec",
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            lineHeight: 24,
            fontFamily: "BarlowCondensed-SemiBold",
            textTransform: "uppercase",
            color: "#111",
            marginBottom: 8,
          }}
        >
          Flagship Store
        </Text>
        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          Løvstræde 1a, 1152 Copenhagen, Denmark
        </Text>
        <Text
          style={{
            paddingTop: 12,
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          Monday: Closed
        </Text>
        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          Tuesday – Saturday: 12:00 – 18:00
        </Text>
        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Regular",
            color: "#666",
          }}
        >
          Sunday: 12:00 – 16:00
        </Text>
        <Text
          style={{
            paddingTop: 12,
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "Inter_18pt-Italic",
            fontStyle: "italic",
            color: "#666",
            marginBottom: 14,
          }}
        >
          Tap the map to find your way to our store.
        </Text>

        <Pressable onPress={openNativeMaps}>
          <Image
            source={require("../assets/support/store-map.png")}
            style={{
              width: "100%",
              height: 260,
              backgroundColor: "#f3f3f3",
            }}
            resizeMode="cover"
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}
