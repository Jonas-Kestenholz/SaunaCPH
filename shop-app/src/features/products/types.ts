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