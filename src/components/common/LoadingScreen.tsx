import { Text, View } from "react-native";
import SaunaLoader from "./SaunaLoader";

type Props = {
  label?: string;
  backgroundColor?: string;
};

export default function LoadingScreen({
  label = "Loading...",
  backgroundColor = "#fff",
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <SaunaLoader size={64} color="#111" label={label} />
    </View>
  );
}