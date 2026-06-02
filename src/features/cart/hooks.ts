import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shopifyRequest } from '../../lib/shopify/client';
import { GET_CART_QUERY } from '../../lib/shopify/queries';
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
} from '../../lib/shopify/mutations';
import { getStoredCartId, storeCartId } from './storage';
import { mapCart } from './mapper';
import type {
  Cart,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesRemoveResponse,
  CartLinesUpdateResponse,
  GetCartResponse,
} from './types';

const CART_QUERY_KEY = ['cart'];

function getUserErrorsMessage(
  userErrors: Array<{ message: string }>,
): string | null {
  if (!userErrors.length) {
    return null;
  }

  return userErrors.map((error) => error.message).join(', ');
}

async function getOrCreateCart(): Promise<Cart> {
  const storedCartId = await getStoredCartId();

  if (storedCartId) {
    const existingCart = await shopifyRequest<GetCartResponse, { id: string }>(
      GET_CART_QUERY,
      { id: storedCartId },
    );

    if (existingCart.cart) {
      return mapCart(existingCart.cart);
    }
  }

  const createdCart = await shopifyRequest<
    CartCreateResponse,
    { input: { lines?: Array<{ merchandiseId: string; quantity: number }> } }
  >(CART_CREATE_MUTATION, {
    input: {},
  });

  const errorMessage = getUserErrorsMessage(createdCart.cartCreate.userErrors);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!createdCart.cartCreate.cart) {
    throw new Error('Shopify kunne ikke oprette en cart');
  }

  await storeCartId(createdCart.cartCreate.cart.id);

  return mapCart(createdCart.cartCreate.cart);
}

export function useCart() {
  return useQuery<Cart, Error>({
    queryKey: CART_QUERY_KEY,
    queryFn: getOrCreateCart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<
    Cart,
    Error,
    {
      merchandiseId: string;
      quantity?: number;
    }
  >({
    mutationFn: async ({ merchandiseId, quantity = 1 }) => {
      const cart = await getOrCreateCart();

      const result = await shopifyRequest<
        CartLinesAddResponse,
        {
          cartId: string;
          lines: Array<{
            merchandiseId: string;
            quantity: number;
          }>;
        }
      >(CART_LINES_ADD_MUTATION, {
        cartId: cart.id,
        lines: [
          {
            merchandiseId,
            quantity,
          },
        ],
      });

      const errorMessage = getUserErrorsMessage(result.cartLinesAdd.userErrors);

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      if (!result.cartLinesAdd.cart) {
        throw new Error('Shopify kunne ikke tilføje varen til cart');
      }

      await storeCartId(result.cartLinesAdd.cart.id);

      return mapCart(result.cartLinesAdd.cart);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart);
    },
  });
}
export function useUpdateCartLine() {
  const queryClient = useQueryClient();

  return useMutation<
    Cart,
    Error,
    {
      lineId: string;
      quantity: number;
    }
  >({
    mutationFn: async ({ lineId, quantity }) => {
      const cart = await getOrCreateCart();

      const result = await shopifyRequest<
        CartLinesUpdateResponse,
        {
          cartId: string;
          lines: Array<{
            id: string;
            quantity: number;
          }>;
        }
      >(CART_LINES_UPDATE_MUTATION, {
        cartId: cart.id,
        lines: [
          {
            id: lineId,
            quantity,
          },
        ],
      });

      const errorMessage = getUserErrorsMessage(
        result.cartLinesUpdate.userErrors,
      );

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      if (!result.cartLinesUpdate.cart) {
        throw new Error('Shopify kunne ikke opdatere cart line');
      }

      await storeCartId(result.cartLinesUpdate.cart.id);

      return mapCart(result.cartLinesUpdate.cart);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart);
    },
  });
}

export function useRemoveCartLine() {
  const queryClient = useQueryClient();

  return useMutation<
    Cart,
    Error,
    {
      lineId: string;
    }
  >({
    mutationFn: async ({ lineId }) => {
      const cart = await getOrCreateCart();

      const result = await shopifyRequest<
        CartLinesRemoveResponse,
        {
          cartId: string;
          lineIds: string[];
        }
      >(CART_LINES_REMOVE_MUTATION, {
        cartId: cart.id,
        lineIds: [lineId],
      });

      const errorMessage = getUserErrorsMessage(
        result.cartLinesRemove.userErrors,
      );

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      if (!result.cartLinesRemove.cart) {
        throw new Error('Shopify kunne ikke fjerne varen fra cart');
      }

      await storeCartId(result.cartLinesRemove.cart.id);

      return mapCart(result.cartLinesRemove.cart);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart);
    },
  });
}