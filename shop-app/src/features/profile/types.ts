export type TrackingStep = {
  label: string;
  description: string;
  date?: string;
  completed: boolean;
};

export type ProfileOrder = {
  id: string;
  name: string;
  processedAt?: string;
  fulfillmentStatus?: string;
  financialStatus?: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status: string;
  updatedAt?: string;
  steps: TrackingStep[];
};

export type CustomerProfile = {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  defaultAddress?: {
    address1?: string;
    city?: string;
    country?: string;
  };
  latestOrder?: ProfileOrder;
  orders: ProfileOrder[];
};

export type GetCustomerProfileQueryResponse = {
  customer: {
    id: string;
    displayName: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    defaultAddress?: {
      address1?: string | null;
      city?: string | null;
      country?: string | null;
    } | null;
    orders: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          processedAt?: string | null;
          fulfillmentStatus?: string | null;
          financialStatus?: string | null;
          fulfillments: Array<{
            trackingInfo: Array<{
              number?: string | null;
              company?: string | null;
              url?: string | null;
            }>;
          }>;
        };
      }>;
    };
  } | null;
};
export type ShopifyCustomer = NonNullable<GetCustomerProfileQueryResponse["customer"]>;

export type ShopifyOrderNode =
  ShopifyCustomer["orders"]["edges"][number]["node"];

export type ShopifyFulfillment =
  ShopifyOrderNode["fulfillments"][number];

export type ShopifyTrackingInfo =
  ShopifyFulfillment["trackingInfo"][number];