function requireValue(value: string | undefined, name: string): string {
  if (!value) {
    console.warn(`Missing environment variable: ${name}`);
    return "";
  }

  return value;
}

function optionalValue(value: string | undefined): string | undefined {
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  shopifyStoreDomain: requireValue(
    process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN,
    "EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN",
  ),

  shopifyApiVersion: requireValue(
    process.env.EXPO_PUBLIC_SHOPIFY_API_VERSION,
    "EXPO_PUBLIC_SHOPIFY_API_VERSION",
  ),

  shopifyStorefrontToken: optionalValue(
    process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  ),

  shopifyCustomerAccountClientId: requireValue(
    process.env.EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
    "EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID",
  ),

  shopifyCustomerAccountRedirectUri: requireValue(
    process.env.EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI,
    "EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI",
  ),
};