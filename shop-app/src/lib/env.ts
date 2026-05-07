function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  shopifyStoreDomain: getRequiredEnv('EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN'),
  shopifyApiVersion: getRequiredEnv('EXPO_PUBLIC_SHOPIFY_API_VERSION'),
  shopifyStorefrontToken: getOptionalEnv('EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN'),
    shopifyCustomerAccessToken: getOptionalEnv(
    "EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCESS_TOKEN"
  ),
};