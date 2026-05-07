import type { ProfileOrder } from "../profile/types";
import type { TrackingCarrier, TrackingDetails } from "./types";

function normalizeCarrier(carrier?: string): TrackingCarrier {
  const value = carrier?.toUpperCase();

  if (value?.includes("DAO")) return "DAO";
  if (value?.includes("GLS")) return "GLS";

  return "UNKNOWN";
}

export function mapOrderToTrackingDetails(order: ProfileOrder): TrackingDetails {
  return {
    carrier: normalizeCarrier(order.carrier),
    trackingNumber: order.trackingNumber,
    status: order.status,
    events: order.steps.map((step, index) => ({
      id: `${order.id}-${index}`,
      label: step.label,
      description: step.description,
      timestamp: step.date,
      completed: step.completed,
    })),
  };
}