import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function health(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Health check requested: ${request.url}`);

  return {
    status: 200,
    jsonBody: {
      ok: true,
      service: "sauna-app-api",
      timestamp: new Date().toISOString(),
    },
  };
}

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: health,
});