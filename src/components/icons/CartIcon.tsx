import Svg, { Rect, Circle, Text as SvgText } from "react-native-svg";

type Props = {
  size?: number;
  filled?: boolean;
  hasNotification?: boolean;
  count?: number;
};

export function CartIcon({
  size = 22,
  filled = false,
  hasNotification = false,
  count,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Rect
        x={7}
        y={11}
        width={16}
        height={12}
        fill={filled ? "#000" : "none"}
        stroke="#000"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />

      <Rect
        x={11}
        y={7}
        width={8}
        height={4}
        fill="none"
        stroke="#000"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />

      {hasNotification ? (
        <>
          <Circle cx={21.5} cy={8.5} r={4.5} fill="#fff" />
          <Circle cx={21.5} cy={8.5} r={2.5} fill="#000" />
        </>
      ) : null}

      {typeof count === "number" && count > 0 ? (
        <SvgText
          x={15}
          y={20.2}
          fill={filled ? "#fff" : "#000"}
          fontSize={9}
          fontWeight="700"
          fontFamily="BarlowCondensed-Bold"
          textAnchor="middle"
        >
          {count > 9 ? "9+" : String(count)}
        </SvgText>
      ) : null}
    </Svg>
  );
}