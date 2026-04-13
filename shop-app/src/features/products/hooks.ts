import { useQuery } from '@tanstack/react-query';
import { shopifyRequest } from '../../../lib/shopify/client';
import { GET_PRODUCTS_QUERY } from '../../../lib/shopify/queries';
import { mapProducts } from './mapper';
import type { GetProductsQueryResponse, ProductListItem } from './types';

const PRODUCTS_QUERY_KEY = ['products'];

export function useProducts(first = 12) {
  return useQuery<ProductListItem[], Error>({
    queryKey: [...PRODUCTS_QUERY_KEY, first],
    queryFn: async () => {
      const data = await shopifyRequest<GetProductsQueryResponse, { first: number }>(
        GET_PRODUCTS_QUERY,
        { first },
      );

      return mapProducts(data);
    },
  });
}
