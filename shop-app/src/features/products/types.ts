export type ProductListItem = {
  id: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  price: string;
  currencyCode: string;
  available: boolean;
};

export type GetProductsQueryResponse = {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        featuredImage: {
          url: string;
          altText: string | null;
        } | null;
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
};

export type ProductVariant = {
  id: string;
  title: string;
  price: string;
  currencyCode: string;
  available: boolean;
  quantityAvailable?: number;

  color?: string;
  size?: string;
};

export type ProductDetail = {
  id: string;
  title: string;
  description?: string;
  available: boolean;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  variants: ProductVariant[];
  relatedColors: RelatedColorProduct[];
};

export type GetProductQueryResponse = {
  product: {
    id: string;
    title: string;
    description: string;
    availableForSale: boolean;

    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };

    relatedColors?: {
      references?: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            featuredImage?: {
              url: string;
              altText: string | null;
            } | null;
          };
        }>;
      } | null;
    } | null;

    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          quantityAvailable?: number | null;
          price: {
            amount: string;
            currencyCode: string;
          };
          selectedOptions?: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
  } | null;
};
export type GetProductByHandleQueryResponse = {
  productByHandle: {
    id: string;
    handle: string;
    title: string;
  } | null;
};
export type RelatedColorProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl?: string;
  imageAlt?: string;
};
