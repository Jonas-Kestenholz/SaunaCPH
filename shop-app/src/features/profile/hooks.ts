import { useQuery } from "@tanstack/react-query";
import { getCustomerAccessToken } from "../auth/storage";
import { shopifyRequest } from "../../lib/shopify/client";
import { GET_CUSTOMER_PROFILE_QUERY } from "../../lib/shopify/queries";
import { mapCustomerProfile } from "./mapper";
import type {
  CustomerProfile,
  GetCustomerProfileQueryResponse,
} from "./types";

export function useCustomerProfile() {
  return useQuery<CustomerProfile | null, Error>({
    queryKey: ["customer-profile"],
    queryFn: async () => {
      const token = await getCustomerAccessToken();

      if (!token) {
        return null;
      }

      const data = await shopifyRequest<
        GetCustomerProfileQueryResponse,
        { customerAccessToken: string }
      >(GET_CUSTOMER_PROFILE_QUERY, {
        customerAccessToken: token,
      });

      return mapCustomerProfile(data);
    },
  });
}