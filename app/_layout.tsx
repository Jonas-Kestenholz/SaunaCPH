import { useEffect } from "react";
import { Stack, usePathname } from "expo-router";
import { View } from "react-native";
import { useFonts } from "expo-font";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AppProviders } from "../src/providers/AppProviders";
import BottomBar from "../src/components/common/BottomBar";
import {
  BottomBarVisibilityProvider,
  useBottomBarVisibility,
} from "../src/components/common/BottomBarVisibilityContext";

function LayoutContent() {
  const pathname = usePathname();
  const { isBottomBarVisible } = useBottomBarVisibility();

  const hideBottomBarByRoute =
    pathname.startsWith("/checkout")

  const bottomBarProgress = useSharedValue(0);

  useEffect(() => {
    bottomBarProgress.value = withTiming(
      !hideBottomBarByRoute && isBottomBarVisible ? 1 : 0,
      {
        duration: 130,
        easing: Easing.out(Easing.cubic),
      },
    );
  }, [hideBottomBarByRoute, isBottomBarVisible, bottomBarProgress]);

  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: (1 - bottomBarProgress.value) * 90,
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
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
          }}
        />

        <Stack.Screen
          name="orders"
          options={{
            animation: "slide_from_right",
          }}
        />

        <Stack.Screen
          name="profile-details"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="app-settings"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>

      <Animated.View
        pointerEvents={
          !hideBottomBarByRoute && isBottomBarVisible ? "auto" : "none"
        }
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          },
          bottomBarAnimatedStyle,
        ]}
      >
        {!hideBottomBarByRoute ? <BottomBar /> : null}
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "BarlowCondensed-Bold": require("../assets/fonts/BarlowCondensed-Bold.ttf"),
    "BarlowCondensed-ExtraBold": require("../assets/fonts/BarlowCondensed-ExtraBold.ttf"),
    "BarlowCondensed-SemiBold": require("../assets/fonts/BarlowCondensed-SemiBold.ttf"),
    "Inter_18pt-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter_18pt-Italic": require("../assets/fonts/Inter_18pt-Italic.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <BottomBarVisibilityProvider>
        <LayoutContent />
      </BottomBarVisibilityProvider>
    </AppProviders>
  );
}
