import { useMutation } from "@tanstack/react-query";
import { saveCustomerAccessToken } from "./storage";

const USE_MOCK_LOGIN = true;

export function useLogin() {
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      if (USE_MOCK_LOGIN) {
        await saveCustomerAccessToken(`mock-token-${Date.now()}`);
        return `mock-token-${Date.now()}`;
      }

      throw new Error("Real Shopify login is disabled while customer accounts are unresolved.");
    },
  });
}