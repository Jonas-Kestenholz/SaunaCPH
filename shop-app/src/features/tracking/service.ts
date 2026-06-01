import type { ProfileOrder } from "../profile/types";
import { mapOrderToTrackingDetails } from "./mapper";
import type { TrackingDetails } from "./types";

export async function getTrackingDetailsFromOrder(
  order: ProfileOrder
): Promise<TrackingDetails> {
  // Later:
  // if DAO → call DAO tracking API
  // if GLS → call GLS tracking API
  // For now: use Shopify order + mapped timeline.
  return mapOrderToTrackingDetails(order);
}