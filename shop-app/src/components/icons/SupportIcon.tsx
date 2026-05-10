import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  filled?: boolean;
};

export function SupportIcon({ size = 22, filled = false }: Props) {
  return (
    <Svg
      width={size}
      height={(size * 18) / 17.5}
      viewBox="0 0 17.5 18"
      fill="none"
    >
      <Path
        d="M 0 14 L 0 0 L 17.5 0 L 17.5 14 L 9.5 14 L 4 18 L 4 14 Z"
        fill={filled ? "#000" : "transparent"}
        stroke="#000"
        strokeWidth={1.5}
      />
    </Svg>
  );
}