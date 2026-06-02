import * as SecureStore from "expo-secure-store";

const CUSTOMER_ACCESS_TOKEN_KEY = "customerAccountAccessToken";
const CUSTOMER_REFRESH_TOKEN_KEY = "customerAccountRefreshToken";
const CUSTOMER_ID_TOKEN_KEY = "customerAccountIdToken";

export async function saveCustomerAccessToken(token: string) {
  await SecureStore.setItemAsync(CUSTOMER_ACCESS_TOKEN_KEY, token);
}

export async function getCustomerAccessToken() {
  return SecureStore.getItemAsync(CUSTOMER_ACCESS_TOKEN_KEY);
}

export async function saveCustomerRefreshToken(token: string) {
  await SecureStore.setItemAsync(CUSTOMER_REFRESH_TOKEN_KEY, token);
}

export async function getCustomerRefreshToken() {
  return SecureStore.getItemAsync(CUSTOMER_REFRESH_TOKEN_KEY);
}

export async function saveCustomerIdToken(token: string) {
  await SecureStore.setItemAsync(CUSTOMER_ID_TOKEN_KEY, token);
}

export async function getCustomerIdToken() {
  return SecureStore.getItemAsync(CUSTOMER_ID_TOKEN_KEY);
}

export async function clearCustomerAccessToken() {
  await SecureStore.deleteItemAsync(CUSTOMER_ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(CUSTOMER_REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(CUSTOMER_ID_TOKEN_KEY);
}