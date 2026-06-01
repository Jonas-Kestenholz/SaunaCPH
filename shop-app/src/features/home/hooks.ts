import { useQuery } from '@tanstack/react-query';
import { shopifyRequest } from '../../lib/shopify/client';
import {
  GET_HOME_SLIDES_QUERY,
  GET_MONTHLY_DROP_OVERLAY_QUERY,
} from '../../lib/shopify/queries';
import { mapHomeSlides, mapMonthlyDropOverlay } from './mapper';
import { isDropModeActive } from './utils';
import type {
  GetHomeSlidesQueryResponse,
  GetMonthlyDropOverlayQueryResponse,
  HomeContent,
  HomeSlide,
  MonthlyDropOverlay,
} from './types';

const HOME_SLIDES_QUERY_KEY = ['home-slides'];
const MONTHLY_DROP_OVERLAY_QUERY_KEY = ['monthly-drop-overlay'];

export function useHomeSlides(first = 10) {
  return useQuery<HomeSlide[], Error>({
    queryKey: [...HOME_SLIDES_QUERY_KEY, first],
    queryFn: async () => {
      const data = await shopifyRequest<
        GetHomeSlidesQueryResponse,
        { type: string; first: number }
      >(GET_HOME_SLIDES_QUERY, {
        type: 'home_slide',
        first,
      });

      return mapHomeSlides(data);
    },
  });
}

export function useMonthlyDropOverlay(first = 5) {
  return useQuery<MonthlyDropOverlay | null, Error>({
    queryKey: [...MONTHLY_DROP_OVERLAY_QUERY_KEY, first],
    queryFn: async () => {
      const data = await shopifyRequest<
        GetMonthlyDropOverlayQueryResponse,
        { type: string; first: number }
      >(GET_MONTHLY_DROP_OVERLAY_QUERY, {
        type: 'monthly_drop_overlay',
        first,
      });

      return mapMonthlyDropOverlay(data);
    },
  });
}

export function useHomeContent() {
  const slidesQuery = useHomeSlides(10);
  const overlayQuery = useMonthlyDropOverlay(5);

  const isLoading = slidesQuery.isLoading || overlayQuery.isLoading;
  const isError = slidesQuery.isError || overlayQuery.isError;
  const error = slidesQuery.error ?? overlayQuery.error ?? null;

  const slides = slidesQuery.data ?? [];
  const overlay = overlayQuery.data ?? null;
  const isDropMode = isDropModeActive(overlay);

  const refetch = () => {
    void slidesQuery.refetch();
    void overlayQuery.refetch();
  };

  const data: HomeContent = {
    slides,
    overlay,
    isDropMode,
  };

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}