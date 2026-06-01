import Svg, { Path } from "react-native-svg";

type Props = {
  filled?: boolean;
  size?: number;
};

export function NotificationIcon({ filled = false, size = 22 }: Props) {
  return (
    <Svg width={size} height={(size * 13) / 14} viewBox="0 0 14 13" fill="none">
      <Path
        d="M 0.938 5.484 C 0.903 2.466 3.341 0 6.36 0 L 7.64 0 C 10.659 0 13.097 2.466 13.063 5.484 L 13.026 8.705 C 13.009 10.193 13.343 11.665 14 13 L 0 13 C 0.657 11.665 0.991 10.193 0.974 8.705 Z"
        fill={filled ? "#000" : "transparent"}
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}