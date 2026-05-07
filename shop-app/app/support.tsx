// app/support.tsx
import { ScrollView, Text, View } from "react-native";
import { FAQItem } from "../src/components/support/FAQItem";
import { SupportForm } from "../src/components/support/SupportForm";

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

export default function SupportScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <Text style={{ fontSize: 30, fontWeight: "800", marginBottom: 6 }}>
        Support
      </Text>

      <Text style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>
        Find answers to common questions or contact customer support.
      </Text>

      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Frequently Asked Questions
      </Text>

      <View>
        {FAQS.map((item) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </View>

      <SupportForm />

      <View style={{ marginTop: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
          Customer Support Hours
        </Text>
        <Text style={{ color: "#666", lineHeight: 22 }}>
          Monday – Friday: 09:00 – 16:00 CET
        </Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
          Flagship Store
        </Text>
        <Text style={{ color: "#666", lineHeight: 22 }}>
          Tuesday – Saturday: 12:00 – 18:00
        </Text>
      </View>
    </ScrollView>
  );
}