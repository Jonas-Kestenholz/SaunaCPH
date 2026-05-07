export type RestockAlert = {
  id: string;
  productId: string;
  variantId?: string;
  productTitle: string;
  variantTitle?: string;
  imageUrl?: string;
  createdAt: string;
};