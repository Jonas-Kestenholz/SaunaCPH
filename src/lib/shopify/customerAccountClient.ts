import { env } from "../env";
import { getCustomerAccessToken } from "../../features/auth/storage";

type CustomerAccountApiConfigResponse = {
  graphql_api: string;
};

type ShopifyCustomerAccountResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
};

export class ShopifyCustomerAccountError extends Error {
  constructor(
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ShopifyCustomerAccountError";
  }
}

let cachedCustomerAccountApiUrl: string | null = null;

async function getCustomerAccountApiUrl() {
  if (cachedCustomerAccountApiUrl) {
    return cachedCustomerAccountApiUrl;
  }

  const configUrl = `https://${env.shopifyStoreDomain}/.well-known/customer-account-api`;

  const response = await fetch(configUrl);

  if (!response.ok) {
    const text = await response.text().catch(() => "");

    throw new ShopifyCustomerAccountError(
      `Could not load Customer Account API configuration: ${response.status}`,
      {
        url: configUrl,
        body: text,
      },
    );
  }

  const json = (await response.json()) as CustomerAccountApiConfigResponse;

  if (!json.graphql_api) {
    throw new ShopifyCustomerAccountError(
      "Customer Account API configuration did not include graphql_api",
      json,
    );
  }

  cachedCustomerAccountApiUrl = json.graphql_api;

  return cachedCustomerAccountApiUrl;
}

export async function customerAccountRequest<
  TData,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(query: string, variables?: TVariables): Promise<TData> {
  const token = await getCustomerAccessToken();

  if (!token) {
    throw new ShopifyCustomerAccountError("Customer is not logged in");
  }

  const customerAccountApiUrl = await getCustomerAccountApiUrl();

  const response = await fetch(customerAccountApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");

    throw new ShopifyCustomerAccountError(
      `Customer Account API request failed with status ${response.status}`,
      {
        url: customerAccountApiUrl,
        body: text,
      },
    );
  }

  const json = (await response.json()) as ShopifyCustomerAccountResponse<TData>;

  if (json.errors?.length) {
    throw new ShopifyCustomerAccountError(
      json.errors.map((error) => error.message).join(", "),
      json.errors,
    );
  }

  if (!json.data) {
    throw new ShopifyCustomerAccountError(
      "Customer Account API response did not include data",
    );
  }

  return json.data;
}