import type { GetProductsQueryResponse, ProductListItem } from './types';

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

export function mapProducts(response: GetProductsQueryResponse): ProductListItem[] {
  return response.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    imageUrl: node.featuredImage?.url,
    imageAlt: node.featuredImage?.altText ?? undefined,
    price: formatPrice(
      node.priceRange.minVariantPrice.amount,
      node.priceRange.minVariantPrice.currencyCode,
    ),
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    available: node.availableForSale,
  }));
}