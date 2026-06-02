import { type ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Props = Omit<PressableProps, "children"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function PressableScale({
  children,
  style,
  onPress,
  ...props
}: Props) {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      android_ripple={{
        color: "rgba(255,255,255,0.35)",
        borderless: false,
      }}
      style={({ pressed }) => [
        style,
        {
          opacity: pressed ? 0.72 : 1,
        },
      ]}
    >
      {children}
    </Pressable>
  );
}