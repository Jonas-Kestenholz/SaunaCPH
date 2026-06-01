import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RestockAlert } from "./types";

const RESTOCK_ALERTS_KEY = "restockAlerts";

export async function getRestockAlerts(): Promise<RestockAlert[]> {
  const value = await AsyncStorage.getItem(RESTOCK_ALERTS_KEY);
  return value ? JSON.parse(value) : [];
}

export async function saveRestockAlert(alert: RestockAlert) {
  const alerts = await getRestockAlerts();

  const exists = alerts.some(
    (item) =>
      item.productId === alert.productId &&
      item.variantId === alert.variantId
  );

  if (exists) return alerts;

  const nextAlerts = [alert, ...alerts];

  await AsyncStorage.setItem(
    RESTOCK_ALERTS_KEY,
    JSON.stringify(nextAlerts)
  );

  return nextAlerts;
}

export async function removeRestockAlert(id: string) {
  const alerts = await getRestockAlerts();
  const nextAlerts = alerts.filter((item) => item.id !== id);

  await AsyncStorage.setItem(
    RESTOCK_ALERTS_KEY,
    JSON.stringify(nextAlerts)
  );

  return nextAlerts;
}