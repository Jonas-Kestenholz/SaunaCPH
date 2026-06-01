import { useMutation } from "@tanstack/react-query";
import { shopifyRequest } from "../../lib/shopify/client";
import { CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION } from "../../lib/shopify/mutations";
import { saveCustomerAccessToken } from "./storage";
import type { CustomerAccessTokenCreateResponse } from "./types";

export function useLogin() {
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const data = await shopifyRequest<
        CustomerAccessTokenCreateResponse,
        { input: { email: string; password: string } }
      >(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { input });

      const errors = data.customerAccessTokenCreate.customerUserErrors;

      if (errors.length > 0) {
        throw new Error(errors[0].message);
      }

      const token = data.customerAccessTokenCreate.customerAccessToken?.accessToken;

      if (!token) {
        throw new Error("Login failed");
      }

      await saveCustomerAccessToken(token);

      return token;
    },
  });
}