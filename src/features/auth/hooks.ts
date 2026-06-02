import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../lib/query-client";
import { loginWithShopifyCustomerAccount } from "./customerAccountAuth";
import { clearCustomerAccessToken } from "./storage";

export function useLogin() {
  return useMutation({
    mutationFn: async () => {
      return loginWithShopifyCustomerAccount();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await clearCustomerAccessToken();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
    },
  });
}