import Svg, { Path, Rect, G } from "react-native-svg";

type Props = {
  size?: number;
  filled?: boolean;
};

export function ProfileIcon({ size = 22, filled = false }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Path
        d="M17.53,15h-5.06c-1.92,0-3.47,1.55-3.47,3.47v4.53h12v-4.53c0-1.92-1.55-3.47-3.47-3.47Z"
        fill={filled ? "#000" : "none"}
        stroke="#000"
        strokeWidth={1.3}
        strokeMiterlimit={10}
      />

      <Rect
        x={12.5}
        y={8}
        width={5}
        height={5}
        rx={2.5}
        ry={2.5}
        fill={filled ? "#000" : "none"}
        stroke="#000"
        strokeWidth={1.3}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}