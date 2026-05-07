import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/query-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}