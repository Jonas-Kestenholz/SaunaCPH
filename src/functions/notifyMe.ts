import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { isAuthorized } from "../shared/auth";
import { getTableClient } from "../shared/tables";

type NotifyMeRequest = {
  customerId?: string;
  email?: string;
  productId?: string;
  variantId?: string;
  productTitle?: string;
  expoPushToken?: string;
};

function createSafeKey(value: string, fallback: string): string {
  const safeValue = value.replace(/[^a-zA-Z0-9]/g, "").slice(-80);

  return safeValue.length > 0 ? safeValue : fallback;
}

function createSafeRowKey(customerId: string, expoPushToken: string): string {
  const safeCustomerId = customerId
    ? createSafeKey(customerId, "anonymous")
    : "anonymous";

  const safeTokenPart = createSafeKey(expoPushToken, "token");

  return `${safeCustomerId}-${safeTokenPart}`;
}
export async function notifyMe(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Notify me request received: ${request.url}`);

  if (!isAuthorized(request)) {
    return {
      status: 401,
      jsonBody: {
        ok: false,
        error: "Unauthorized",
      },
    };
  }

  let body: NotifyMeRequest;

  try {
    body = (await request.json()) as NotifyMeRequest;
  } catch {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "Invalid JSON body",
      },
    };
  }

  const productId = body.productId?.trim();
  const variantId = body.variantId?.trim();
  const expoPushToken = body.expoPushToken?.trim();
  const customerId = body.customerId?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const productTitle = body.productTitle?.trim() ?? "";

  if (!productId) {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "productId is required",
      },
    };
  }

  if (!variantId) {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "variantId is required",
      },
    };
  }

  if (!expoPushToken) {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "expoPushToken is required",
      },
    };
  }

  const tableClient = getTableClient("NotifyMeRegistrations");

  await tableClient.createTable();

  const now = new Date().toISOString();

  const safeVariantPartitionKey = createSafeKey(variantId, "unknownVariant");

  await tableClient.upsertEntity(
    {
      partitionKey: safeVariantPartitionKey,
      rowKey: createSafeRowKey(customerId, expoPushToken),
      customerId,
      email,
      productId,
      variantId,
      productTitle,
      expoPushToken,
      active: true,
      createdAt: now,
      updatedAt: now,
      notifiedAt: "",
    },
    "Replace",
  );

  context.log(`Notify me registration saved for variant ${variantId}`);

  return {
    status: 201,
    jsonBody: {
      ok: true,
      message: "Notify me registration saved",
    },
  };
}

app.http("notifyMe", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "notify-me",
  handler: notifyMe,
});
