import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ShopifyCheckoutSheetProvider } from "@shopify/checkout-sheet-kit";

import { queryClient } from "../lib/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ShopifyCheckoutSheetProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ShopifyCheckoutSheetProvider>
    </GestureHandlerRootView>
  );
}