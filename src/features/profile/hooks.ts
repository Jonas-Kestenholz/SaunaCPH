import { useQuery } from "@tanstack/react-query";

import { getCustomerAccessToken } from "../auth/storage";
import { customerAccountRequest } from "../../lib/shopify/customerAccountClient";
import { GET_CUSTOMER_ACCOUNT_PROFILE_QUERY } from "../../lib/shopify/queries";
import type { CustomerProfile, ProfileOrder } from "./types";

type CustomerAccountProfileResponse = {
  customer: {
    id: string;
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: {
      emailAddress?: string | null;
    } | null;
    phoneNumber?: {
      phoneNumber?: string | null;
    } | null;
    defaultAddress?: {
      address1?: string | null;
      city?: string | null;
      country?: string | null;
    } | null;
    orders?: {
      edges: Array<{
        node: {
          id: string;
          name?: string | null;
          processedAt?: string | null;
          fulfillmentStatus?: string | null;
          totalPrice?: {
            amount?: string | null;
            currencyCode?: string | null;
          } | null;
          lineItems?: {
            edges: Array<{
              node: {
                id: string;
                name?: string | null;
                title?: string | null;
                quantity: number;
                variantTitle?: string | null;
                sku?: string | null;
                image?: {
                  url?: string | null;
                  altText?: string | null;
                } | null;
                totalPrice?: {
                  amount?: string | null;
                  currencyCode?: string | null;
                } | null;
                variantOptions?: Array<{
                  name: string;
                  value: string;
                }> | null;
              };
            }>;
          } | null;
        };
      }>;
    } | null;
  };
};

function createBasicOrder(order: {
  id: string;
  name?: string | null;
  processedAt?: string | null;
  fulfillmentStatus?: string | null;
  totalPrice?: {
    amount?: string | null;
    currencyCode?: string | null;
  } | null;
  lineItems?: {
    edges: Array<{
      node: {
        id: string;
        name?: string | null;
        title?: string | null;
        quantity: number;
        variantTitle?: string | null;
        image?: {
          url?: string | null;
          altText?: string | null;
        } | null;
        totalPrice?: {
          amount?: string | null;
          currencyCode?: string | null;
        } | null;
      };
    }>;
  } | null;
}): ProfileOrder {
  const lineItems =
    order.lineItems?.edges.map(({ node }) => ({
      id: node.id,
      title: node.name ?? node.title ?? "Product",
      variantTitle: node.variantTitle ?? undefined,
      quantity: node.quantity,
      price: formatMoney(node.totalPrice),
      imageUrl: node.image?.url ?? undefined,
    })) ?? [];

  return {
    id: order.id,
    name: order.name ?? "",
    processedAt: order.processedAt ?? undefined,
    fulfillmentStatus: order.fulfillmentStatus ?? undefined,
    financialStatus: undefined,
    carrier: undefined,
    trackingNumber: undefined,
    trackingUrl: undefined,
    status: "Order received",
    updatedAt: order.processedAt ?? undefined,
    totalPrice: formatMoney(order.totalPrice),
    lineItems,
    steps: [
      {
        label: "Order placed",
        description: "Your order has been created.",
        completed: true,
      },
      {
        label: "Processing",
        description: "Your order is being prepared.",
        completed: false,
      },
      {
        label: "Shipped",
        description: "Waiting for tracking information.",
        completed: false,
      },
      {
        label: "Delivered",
        description: "Your package has been delivered.",
        completed: false,
      },
    ],
  };
}

function formatMoney(
  money?: { amount?: string | null; currencyCode?: string | null } | null,
) {
  if (!money?.amount || !money.currencyCode) {
    return undefined;
  }

  const amount = Number(money.amount);

  if (Number.isNaN(amount)) {
    return `${money.amount} ${money.currencyCode}`;
  }

  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: money.currencyCode,
  }).format(amount);
}

function mapCustomerAccountProfile(
  response: CustomerAccountProfileResponse,
): CustomerProfile {
  const customer = response.customer;

  const orders =
    customer.orders?.edges
      .map(({ node }) => createBasicOrder(node))
      .sort((a, b) => {
        const dateA = a.processedAt ? new Date(a.processedAt).getTime() : 0;
        const dateB = b.processedAt ? new Date(b.processedAt).getTime() : 0;

        return dateB - dateA;
      }) ?? [];

  const displayName =
    customer.displayName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    customer.emailAddress?.emailAddress ||
    "";

  return {
    id: customer.id,
    displayName,
    firstName: customer.firstName ?? undefined,
    lastName: customer.lastName ?? undefined,
    email: customer.emailAddress?.emailAddress ?? undefined,
    phone: customer.phoneNumber?.phoneNumber ?? undefined,

    defaultAddress: customer.defaultAddress
      ? {
          address1: customer.defaultAddress.address1 ?? undefined,
          city: customer.defaultAddress.city ?? undefined,
          country: customer.defaultAddress.country ?? undefined,
        }
      : undefined,

    latestOrder: orders[0],
    orders,
  };
}

export function useCustomerProfile() {
  return useQuery<CustomerProfile | null, Error>({
    queryKey: ["customer-profile"],
    queryFn: async () => {
      const token = await getCustomerAccessToken();

      if (!token) {
        return null;
      }

      const data = await customerAccountRequest<CustomerAccountProfileResponse>(
        GET_CUSTOMER_ACCOUNT_PROFILE_QUERY,
      );

      return mapCustomerAccountProfile(data);
    },
  });
}
