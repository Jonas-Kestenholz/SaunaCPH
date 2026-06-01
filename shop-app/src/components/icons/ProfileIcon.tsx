import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  filled?: boolean;
};

export function ProfileIcon({ size = 22, filled = false }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      
      {/* Head */}
      <Path
        d="M 3 4 C 3 1.791 4.791 0 7 0 C 9.209 0 11 1.791 11 4 C 11 6.209 9.209 8 7 8 C 4.791 8 3 6.209 3 4 Z"
        fill={filled ? "#000" : "transparent"}
        stroke="#000"
        strokeWidth={1.5}
      />

      {/* Body */}
      <Path
        d="M 0 9 C 0 6.239 2.239 4 5 4 L 7 4 L 9 4 C 11.761 4 14 6.239 14 9 L 14 12 L 0 12 Z"
        fill={filled ? "#000" : "transparent"}
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}