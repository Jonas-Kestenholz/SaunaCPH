import { useQuery } from '@tanstack/react-query';
import { shopifyRequest } from '../../lib/shopify/client';
import {
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_QUERY,
  GET_PRODUCTS_QUERY,
} from '../../lib/shopify/queries';
import { mapProduct, mapProducts } from './mapper';
import type {
  GetProductByHandleQueryResponse,
  GetProductQueryResponse,
  GetProductsQueryResponse,
  ProductDetail,
  ProductListItem,
} from './types';

const PRODUCTS_QUERY_KEY = ['products'];
const PRODUCT_QUERY_KEY = ['product'];

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

export function useProduct(id?: string) {
  return useQuery<ProductDetail, Error>({
    queryKey: [...PRODUCT_QUERY_KEY, id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new Error('Mangler produkt-id');
      }

      const data = await shopifyRequest<GetProductQueryResponse, { id: string }>(
        GET_PRODUCT_QUERY,
        { id },
      );

      return mapProduct(data);
    },
  });
}
export async function getProductIdByHandle(handle: string): Promise<string | null> {
  const data = await shopifyRequest<
    GetProductByHandleQueryResponse,
    { handle: string }
  >(GET_PRODUCT_BY_HANDLE_QUERY, {
    handle,
  });

  return data.productByHandle?.id ?? null;
}
