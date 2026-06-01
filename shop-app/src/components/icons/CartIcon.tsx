import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
};

export function CartIcon({ size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M 2 7 L 18 7 L 18 19 L 2 19 Z"
        fill="transparent"
        stroke="#000"
        strokeWidth={1.5}
      />
      <Path
        d="M 6 1 L 14 1 L 14 7 L 6 7 Z"
        fill="transparent"
        stroke="#000"
        strokeWidth={1.5}
      />
    </Svg>
  );
}