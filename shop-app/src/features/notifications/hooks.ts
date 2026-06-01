import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRestockAlerts,
  removeRestockAlert,
  saveRestockAlert,
} from "./storage";
import type { RestockAlert } from "./types";

const QUERY_KEY = ["restock-alerts"];

export function useRestockAlerts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getRestockAlerts,
  });
}

export function useSaveRestockAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveRestockAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useRemoveRestockAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeRestockAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function createRestockAlert(input: {
  productId: string;
  variantId?: string;
  productTitle: string;
  variantTitle?: string;
  imageUrl?: string;
}): RestockAlert {
  return {
    id: `${input.productId}-${input.variantId ?? "product"}-${Date.now()}`,
    productId: input.productId,
    variantId: input.variantId,
    productTitle: input.productTitle,
    variantTitle: input.variantTitle,
    imageUrl: input.imageUrl,
    createdAt: new Date().toISOString(),
  };
}