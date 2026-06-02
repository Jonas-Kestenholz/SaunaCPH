import { useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Text } from "react-native";

type Props = {
  size?: number;
  color?: string;
  label?: string;
};

export default function SaunaLoader({
  size = 46,
  color = "#111",
  label,
}: Props) {
  const rotation = useSharedValue(0);
  const labelOpacity = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1100,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      }),
      -1,
      false,
    );

    labelOpacity.value = withRepeat(
      withTiming(0.2, {
        duration: 550,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      }),
      -1,
      true,
    );
  }, [rotation, labelOpacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: labelOpacity.value,
    };
  });

  return (
    <Animated.View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          },
          animatedStyle,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 70 70">
          <Path
            fill={color}
            d="M49,48.7c3.43,0,6.36-2.16,7.52-5.18l3.48-2.87-3.48-2.87c-1.16-3.03-4.09-5.18-7.52-5.18h-4.58l-.77-6.49h8.59v2.88h4.81v-10.58h-4.81v2.88h-9.16l-1.34-11.3h-13.48l-1.34,11.3h-5.92c-3.43,0-6.36,2.16-7.52,5.18l-3.48,2.87,3.48,2.87c1.16,3.03,4.09,5.18,7.52,5.18h4.01l-.77,6.49h-6.48v-2.88h-4.81v10.58h4.81v-2.88h5.91l-.77,6.49h-3v4.81h10.58v-4.81h-2.74l.77-6.49h12.98l.77,6.49h-2.74v4.81h10.58v-4.81h-3l-.77-6.49h2.67ZM49,37.4c1.79,0,3.25,1.46,3.25,3.25s-1.46,3.25-3.25,3.25h-3.24l-.77-6.49h4.01ZM39.58,32.6h-9.16l.77-6.49h7.62l.77,6.49ZM32.53,14.81h4.94l.77,6.49h-6.48l.77-6.49ZM21,32.6c-1.79,0-3.25-1.46-3.25-3.25s1.46-3.25,3.25-3.25h5.35l-.77,6.49h-4.58ZM29.08,43.89l.77-6.49h10.3l.77,6.49h-11.84Z"
          />
        </Svg>
      </Animated.View>

      {label ? (
        <Animated.View style={labelAnimatedStyle}>
          <Text
            style={{
              marginTop: 16,
              fontSize: 13,
              lineHeight: 19,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
            }}
          >
            {label}
          </Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
