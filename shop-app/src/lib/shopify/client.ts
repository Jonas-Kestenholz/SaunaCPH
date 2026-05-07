import { env } from "../env";

type ShopifyResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
};

export class ShopifyError extends Error {
  constructor(
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

const SHOPIFY_STOREFRONT_API_URL = `https://${env.shopifyStoreDomain}/api/${env.shopifyApiVersion}/graphql.json`;

export async function shopifyRequest<
  TData,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(query: string, variables?: TVariables): Promise<TData> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (env.shopifyStorefrontToken) {
    headers["X-Shopify-Storefront-Access-Token"] = env.shopifyStorefrontToken;
  }

  console.log("Shopify URL:", SHOPIFY_STOREFRONT_API_URL);
  console.log("Has token:", Boolean(env.shopifyStorefrontToken));
  console.log("Token prefix:", env.shopifyStorefrontToken?.slice(0, 6));

  const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ShopifyError(
      `Shopify request failed with status ${response.status}`,
      { url: SHOPIFY_STOREFRONT_API_URL, body: text },
    );
  }

  const json = (await response.json()) as ShopifyResponse<TData>;

  if (json.errors?.length) {
    throw new ShopifyError(
      json.errors.map((error) => error.message).join(", "),
      json.errors,
    );
  }

  if (!json.data) {
    throw new ShopifyError("Shopify response did not include data");
  }

  return json.data;
}
