import { HttpRequest } from "@azure/functions";

export function isAuthorized(request: HttpRequest): boolean {
  const expectedApiKey = process.env.SAUNA_API_KEY;

  if (!expectedApiKey) {
    return false;
  }

  const providedApiKey = request.headers.get("x-api-key");

  return providedApiKey === expectedApiKey;
}