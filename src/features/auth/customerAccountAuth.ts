import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { env } from "../../lib/env";
import {
  saveCustomerAccessToken,
  saveCustomerIdToken,
  saveCustomerRefreshToken,
} from "./storage";

WebBrowser.maybeCompleteAuthSession();

type OAuthDiscoveryResponse = {
  authorization_endpoint: string;
  token_endpoint: string;
};

type CustomerAccountTokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
};

function base64UrlEncode(input: string) {
  return input
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function createCodeVerifier() {
  const randomBytes = await Crypto.getRandomBytesAsync(32);

  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createCodeChallenge(codeVerifier: string) {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    {
      encoding: Crypto.CryptoEncoding.BASE64,
    },
  );

  return base64UrlEncode(digest);
}

async function createState() {
  const randomBytes = await Crypto.getRandomBytesAsync(16);

  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getOAuthDiscovery() {
  const discoveryUrl = `https://${env.shopifyStoreDomain}/.well-known/openid-configuration`;

  const response = await fetch(discoveryUrl);

  if (!response.ok) {
    throw new Error(`Could not load Shopify OAuth discovery: ${response.status}`);
  }

  return response.json() as Promise<OAuthDiscoveryResponse>;
}

async function exchangeCodeForToken(params: {
  tokenEndpoint: string;
  code: string;
  codeVerifier: string;
}) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.shopifyCustomerAccountClientId,
    redirect_uri: env.shopifyCustomerAccountRedirectUri,
    code: params.code,
    code_verifier: params.codeVerifier,
  });

  const response = await fetch(params.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const json = (await response.json()) as
    | CustomerAccountTokenResponse
    | { error?: string; error_description?: string };

  if (!response.ok || "error" in json) {
    throw new Error(
      "error_description" in json && json.error_description
        ? json.error_description
        : "Could not exchange Shopify login code for token.",
    );
  }

  return json as CustomerAccountTokenResponse;
}

export async function loginWithShopifyCustomerAccount() {
  const discovery = await getOAuthDiscovery();

  const codeVerifier = await createCodeVerifier();
  const codeChallenge = await createCodeChallenge(codeVerifier);
  const state = await createState();

  const authUrl =
    `${discovery.authorization_endpoint}?` +
    new URLSearchParams({
      client_id: env.shopifyCustomerAccountClientId,
      redirect_uri: env.shopifyCustomerAccountRedirectUri,
      response_type: "code",
      scope: "openid email customer-account-api:full",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    }).toString();

  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    env.shopifyCustomerAccountRedirectUri,
  );

  if (result.type !== "success") {
    throw new Error("Login was cancelled.");
  }

  const callbackUrl = new URL(result.url);
  const returnedState = callbackUrl.searchParams.get("state");
  const code = callbackUrl.searchParams.get("code");
  const error = callbackUrl.searchParams.get("error");

  if (error) {
    throw new Error(error);
  }

  if (!code) {
    throw new Error("Shopify did not return a login code.");
  }

  if (returnedState !== state) {
    throw new Error("Invalid Shopify login state.");
  }

  const token = await exchangeCodeForToken({
    tokenEndpoint: discovery.token_endpoint,
    code,
    codeVerifier,
  });
  console.log("Customer Account login success");
console.log("Access token prefix:", token.access_token.slice(0, 16));
console.log("Token type:", token.token_type);
console.log("Has refresh token:", Boolean(token.refresh_token));
console.log("Has id token:", Boolean(token.id_token));

  await saveCustomerAccessToken(token.access_token);

  if (token.refresh_token) {
    await saveCustomerRefreshToken(token.refresh_token);
  }

  if (token.id_token) {
    await saveCustomerIdToken(token.id_token);
  }

  return token.access_token;
}