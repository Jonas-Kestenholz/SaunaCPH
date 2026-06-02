import Svg, { Polygon } from "react-native-svg";

type Props = {
  size?: number;
  filled?: boolean;
};

export function SupportIcon({ size = 22, filled = false }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Polygon
        points="10 19 10 23 18 19 23 19 23 7 7 7 7 19 10 19"
        fill={filled ? "#000" : "none"}
        stroke="#000"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}