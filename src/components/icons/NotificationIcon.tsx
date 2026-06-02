import Svg, { Path, Circle } from "react-native-svg";

type Props = {
  filled?: boolean;
  hasNotification?: boolean;
  size?: number;
};

export function NotificationIcon({
  filled = false,
  hasNotification = false,
  size = 22,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Path
        d="M15,7h0c-3.31,0-6,2.69-6,6v4l-1,3h14l-1-3v-4c0-.32-.02-.63-.07-.93-.34-2.2-1.88-4-3.93-4.73-.63-.22-1.3-.34-2-.34Z"
        fill={filled ? "#000" : "none"}
        stroke="#000"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />

      <Path
        d="M18,20h0c0,1.66-1.34,3-3,3h0c-1.66,0-3-1.34-3-3h0"
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
    </Svg>
  );
}