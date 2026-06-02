import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

type Props = {
  question: string;
  answer: string;
};

function ArrowDownIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 30 30">
      <Polyline
        points="8 11.5 15 18.5 22 11.5"
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

function ArrowUpIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 30 30">
      <Polyline
        points="8 18.5 15 11.5 22 18.5"
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

export function FAQItem({ question, answer }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#ececec",
      }}
    >
      <Pressable
        onPress={() => setIsOpen((current) => !current)}
        style={{
          minHeight: 54,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            lineHeight: 20,
            fontFamily: "BarlowCondensed-SemiBold",
            textTransform: "uppercase",
            color: "#111",
          }}
        >
          {question}
        </Text>

        <View
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </View>
      </Pressable>

      {isOpen ? (
        <View
          style={{
            paddingBottom: 18,
            paddingRight: 34,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
            }}
          >
            {answer}
          </Text>
        </View>
      ) : null}
    </View>
  );
}