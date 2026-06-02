import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { isAuthorized } from "../shared/auth";
import { getTableClient } from "../shared/tables";

type SupportMessageRequest = {
  customerId?: string;
  email?: string;
  name?: string;
  message?: string;
};

function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".");
}

export async function supportMessage(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Support message request received: ${request.url}`);

  if (!isAuthorized(request)) {
    return {
      status: 401,
      jsonBody: {
        ok: false,
        error: "Unauthorized",
      },
    };
  }

  let body: SupportMessageRequest;

  try {
    body = (await request.json()) as SupportMessageRequest;
  } catch {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "Invalid JSON body",
      },
    };
  }

  const email = body.email?.trim();
  const message = body.message?.trim();
  const name = body.name?.trim() ?? "";
  const customerId = body.customerId?.trim() ?? "";

  if (!email || !isValidEmail(email)) {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "Valid email is required",
      },
    };
  }

  if (!message || message.length < 2) {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "Message is required",
      },
    };
  }

  if (message.length > 3000) {
    return {
      status: 400,
      jsonBody: {
        ok: false,
        error: "Message is too long",
      },
    };
  }

  const tableClient = getTableClient("SupportMessages");

  await tableClient.createTable();

  const now = new Date().toISOString();

  await tableClient.createEntity({
    partitionKey: email.toLowerCase(),
    rowKey: `${Date.now()}`,
    customerId,
    email,
    name,
    message,
    status: "new",
    createdAt: now,
  });

  context.log(`Support message saved for ${email}`);

  return {
    status: 201,
    jsonBody: {
      ok: true,
      message: "Support message received",
    },
  };
}

app.http("supportMessage", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "support-message",
  handler: supportMessage,
});