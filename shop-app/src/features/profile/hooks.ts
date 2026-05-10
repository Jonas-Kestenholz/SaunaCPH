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

  if (token.startsWith("mock-token")) {
    const latestOrder = {
      id: "mock-order-1",
      name: "#1001",
      processedAt: "2026-04-14T08:14:48Z",
      fulfillmentStatus: "IN_TRANSIT",
      financialStatus: "PAID",
      carrier: "DAO",
      trackingNumber: "00057151273606671265",
      trackingUrl: undefined,
      status: "På vej til daoSHOP",
      updatedAt: "14. apr. 2026 08:14:48",
      steps: [
        {
          label: "Order placed",
          description: "Forsendelse er oprettet, afventer registrering",
          date: "12. apr. 2026 10:23:19",
          completed: true,
        },
        {
          label: "Sorted",
          description: "Pakken er sorteret på terminal Sjælland",
          date: "14. apr. 2026 01:36:39",
          completed: true,
        },
        {
          label: "In transit",
          description: "På vej til daoSHOP",
          date: "14. apr. 2026 08:14:48",
          completed: true,
        },
        {
          label: "Ready for pickup",
          description: "Klar til afhentning",
          completed: false,
        },
        {
          label: "Delivered",
          description: "Pakken er udleveret",
          completed: false,
        },
      ],
    };

    return {
      id: "mock-customer-1",
      displayName: "Sylvester",
      firstName: "Sylvester",
      lastName: "SAUNA",
      email: "customer@sauna.dk",
      phone: undefined,

      defaultAddress: {
        address1: "Lavendelstræde 14",
        city: "Copenhagen",
        country: "Denmark",
      },

      latestOrder,

      orders: [latestOrder],
    } as CustomerProfile;
  }

  const data = await shopifyRequest<
    GetCustomerProfileQueryResponse,
    { customerAccessToken: string }
  >(GET_CUSTOMER_PROFILE_QUERY, {
    customerAccessToken: token,
  });

  return mapCustomerProfile(data);
},  });
}