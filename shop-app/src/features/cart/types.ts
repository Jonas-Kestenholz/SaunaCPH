export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  imageUrl?: string;
  price: string;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: string;
  total: string;
  lines: CartLine[];
};

export type ShopifyCartResponse = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
            handle: string;
            featuredImage?: {
              url: string;
              altText: string | null;
            } | null;
          };
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
};

export type CartCreateResponse = {
  cartCreate: {
    cart: ShopifyCartResponse | null;
    userErrors: Array<{
      field?: string[] | null;
      message: string;
    }>;
  };
};

export type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: ShopifyCartResponse | null;
    userErrors: Array<{
      field?: string[] | null;
      message: string;
    }>;
  };
};

export type GetCartResponse = {
  cart: ShopifyCartResponse | null;
};
export type CartLinesUpdateResponse = {
  cartLinesUpdate: {
    cart: ShopifyCartResponse | null;
    userErrors: Array<{
      field?: string[] | null;
      message: string;
    }>;
  };
};

export type CartLinesRemoveResponse = {
  cartLinesRemove: {
    cart: ShopifyCartResponse | null;
    userErrors: Array<{
      field?: string[] | null;
      message: string;
    }>;
  };
};