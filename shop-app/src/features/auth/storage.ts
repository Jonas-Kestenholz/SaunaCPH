import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOMER_TOKEN_KEY = "customerAccessToken";

export async function saveCustomerAccessToken(token: string) {
  await AsyncStorage.setItem(CUSTOMER_TOKEN_KEY, token);
}

export async function getCustomerAccessToken() {
  return AsyncStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export async function clearCustomerAccessToken() {
  await AsyncStorage.removeItem(CUSTOMER_TOKEN_KEY);
}