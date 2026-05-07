import { View, Text } from "react-native";
import type { TrackingStep } from "../../features/profile/types";

type Props = {
  steps: TrackingStep[];
};

export function TrackingTimeline({ steps }: Props) {
  return (
    <View style={{ marginTop: 18 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {steps.map((step, index) => (
          <View
            key={step.label}
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: 11,
                height: 11,
                borderRadius: 999,
                backgroundColor: step.completed ? "#000" : "#DADADA",
              }}
            />

            {index < steps.length - 1 && (
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: steps[index + 1].completed ? "#000" : "#DADADA",
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}