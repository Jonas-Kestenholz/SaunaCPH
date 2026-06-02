import { Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 10,
      }}
    >
      <Stack.Screen
        name="product"
        options={{
          animation: "slide_from_right",
          animationDuration: undefined,
        }}
      />
    </Stack>
  );
}
