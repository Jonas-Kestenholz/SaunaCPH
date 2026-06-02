"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = health;
const functions_1 = require("@azure/functions");
async function health(request, context) {
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
functions_1.app.http("health", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "health",
    handler: health,
});
//# sourceMappingURL=health.js.map