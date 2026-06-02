export type TrackingCarrier = "DAO" | "GLS" | "UNKNOWN";

export type TrackingEvent = {
  id: string;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
};

export type TrackingDetails = {
  carrier: TrackingCarrier;
  trackingNumber?: string;
  status: string;
  events: TrackingEvent[];
};