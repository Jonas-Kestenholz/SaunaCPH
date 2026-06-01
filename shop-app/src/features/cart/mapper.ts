import type { Cart, ShopifyCartResponse } from './types';

function formatPrice(amount: string, currencyCode: string): string {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return amount;
  }

  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
}

export function mapCart(cart: ShopifyCartResponse): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: formatPrice(
      cart.cost.subtotalAmount.amount,
      cart.cost.subtotalAmount.currencyCode,
    ),
    total: formatPrice(
      cart.cost.totalAmount.amount,
      cart.cost.totalAmount.currencyCode,
    ),
    lines: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      variantId: node.merchandise.id,
      variantTitle: node.merchandise.title,
      productId: node.merchandise.product.id,
      productTitle: node.merchandise.product.title,
      productHandle: node.merchandise.product.handle,
      imageUrl: node.merchandise.product.featuredImage?.url,
      price: formatPrice(
        node.merchandise.price.amount,
        node.merchandise.price.currencyCode,
      ),
    })),
  };
}