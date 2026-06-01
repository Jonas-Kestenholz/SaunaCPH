import { useQuery } from "@tanstack/react-query";
import type { ProfileOrder } from "../profile/types";
import { getTrackingDetailsFromOrder } from "./service";

export function useTrackingDetails(order?: ProfileOrder) {
  return useQuery({
    queryKey: ["tracking-details", order?.id, order?.trackingNumber],
    enabled: Boolean(order),
    queryFn: () => getTrackingDetailsFromOrder(order!),
  });
}