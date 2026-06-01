import type {
  GetProductQueryResponse,
  GetProductsQueryResponse,
  ProductDetail,
  ProductListItem,
} from "./types";

function formatPrice(amount: string, currencyCode: string): string {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return amount;
  }

  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: currencyCode,
  }).format(numericAmount);
}

function dedupeProducts<T extends { id: string }>(products: T[]): T[] {
  return Array.from(
    new Map(products.map((product) => [product.id, product])).values(),
  );
}

export function mapProducts(
  response: GetProductsQueryResponse,
): ProductListItem[] {
  const mappedProducts = response.products.edges.map(({ node }) => ({
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

  return dedupeProducts(mappedProducts);
}

export function mapProduct(response: GetProductQueryResponse): ProductDetail {
  if (!response.product) {
    throw new Error("Produktet blev ikke fundet");
  }

  return {
    id: response.product.id,
    title: response.product.title,
    description: response.product.description || undefined,
    available: response.product.availableForSale,

    images: response.product.images.edges.map(({ node }) => ({
      url: node.url,
      alt: node.altText ?? undefined,
    })),

    relatedColors:
      response.product.relatedColors?.references?.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        imageUrl: node.featuredImage?.url,
        imageAlt: node.featuredImage?.altText ?? undefined,
      })) ?? [],

    variants: response.product.variants.edges.map(({ node }) => {
      const selectedOptions = node.selectedOptions ?? [];

      const colorOption = selectedOptions.find(
        (option) => option.name.toLowerCase() === "color",
      );

      const sizeOption = selectedOptions.find(
        (option) => option.name.toLowerCase() === "size",
      );

      return {
        id: node.id,
        title: node.title,
        price: formatPrice(node.price.amount, node.price.currencyCode),
        currencyCode: node.price.currencyCode,
        available: node.availableForSale,
        quantityAvailable: node.quantityAvailable ?? undefined,
        color: colorOption?.value,
        size: sizeOption?.value,
      };
    }),
  };
}