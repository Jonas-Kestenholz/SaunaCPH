import { Stack } from 'expo-router';
import { AppProviders } from '../../src/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            animation: 'default',
          }}
        />
        <Stack.Screen
          name="products"
          options={{
            presentation: 'modal',
            gestureDirection: 'vertical',
            animation: 'slide_from_bottom',
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            animation: 'default',
          }}
        />
      </Stack>
    </AppProviders>
  );
}