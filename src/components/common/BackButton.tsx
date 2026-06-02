import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Svg, { Polyline } from "react-native-svg";

function ArrowLeftIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 30 30">
      <Polyline
        points="18.5 22 11.5 15 18.5 8"
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

type Props = {
  onPress?: () => void;
};

export default function BackButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      style={{
        width: 44,
        height: 44,
        alignItems: "flex-start",
        justifyContent: "center",
        marginBottom: 10,
      }}
    >
      <ArrowLeftIcon />
    </TouchableOpacity>
  );
}