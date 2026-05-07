import type {
  CustomerProfile,
  GetCustomerProfileQueryResponse,
  ProfileOrder,
  TrackingStep,
  ShopifyOrderNode,
  ShopifyFulfillment,
  ShopifyTrackingInfo,
} from "./types";

function createTrackingSteps(order: {
  fulfillmentStatus?: string | null;
  trackingNumber?: string;
}): TrackingStep[] {
  const hasTracking = Boolean(order.trackingNumber);
  const isFulfilled = order.fulfillmentStatus === "FULFILLED";

  return [
    {
      label: "Order placed",
      description: "Your order has been created.",
      completed: true,
    },
    {
      label: "Processing",
      description: "Your order is being prepared.",
      completed: true,
    },
    {
      label: "Shipped",
      description: hasTracking
        ? "Tracking information has been added."
        : "Waiting for tracking information.",
      completed: hasTracking || isFulfilled,
    },
    {
      label: "Delivered",
      description: "Your package has been delivered.",
      completed: false,
    },
  ];
}

function mapOrder(node: ShopifyOrderNode): ProfileOrder {
  const trackingInfo = node.fulfillments
    ?.flatMap((fulfillment: ShopifyFulfillment) => fulfillment.trackingInfo ?? [])
    ?.find(
      (tracking: ShopifyTrackingInfo) => tracking.number || tracking.url
    );

  const trackingNumber = trackingInfo?.number ?? undefined;

  return {
    id: node.id,
    name: node.name,
    processedAt: node.processedAt ?? undefined,
    fulfillmentStatus: node.fulfillmentStatus ?? undefined,
    financialStatus: node.financialStatus ?? undefined,
    carrier: trackingInfo?.company ?? undefined,
    trackingNumber,
    trackingUrl: trackingInfo?.url ?? undefined,
    status: trackingNumber
      ? `Shipped with ${trackingInfo?.company ?? "carrier"}`
      : node.fulfillmentStatus ?? "Order received",
    updatedAt: node.processedAt ?? undefined,
    steps: createTrackingSteps({
      fulfillmentStatus: node.fulfillmentStatus,
      trackingNumber,
    }),
  };
}

export function mapCustomerProfile(
  data: GetCustomerProfileQueryResponse
): CustomerProfile | null {
  if (!data.customer) return null;

  const orders = data.customer.orders.edges.map((edge) => mapOrder(edge.node));

  return {
    id: data.customer.id,
    displayName: data.customer.displayName,
    firstName: data.customer.firstName ?? undefined,
    lastName: data.customer.lastName ?? undefined,
    email: data.customer.email ?? undefined,
    phone: data.customer.phone ?? undefined,
    defaultAddress: data.customer.defaultAddress
      ? {
          address1: data.customer.defaultAddress.address1 ?? undefined,
          city: data.customer.defaultAddress.city ?? undefined,
          country: data.customer.defaultAddress.country ?? undefined,
        }
      : undefined,
    latestOrder: orders[0],
    orders,
  };
}