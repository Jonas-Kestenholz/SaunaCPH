"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportMessage = supportMessage;
const functions_1 = require("@azure/functions");
const auth_1 = require("../shared/auth");
const tables_1 = require("../shared/tables");
function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}
async function supportMessage(request, context) {
    context.log(`Support message request received: ${request.url}`);
    if (!(0, auth_1.isAuthorized)(request)) {
        return {
            status: 401,
            jsonBody: {
                ok: false,
                error: "Unauthorized",
            },
        };
    }
    let body;
    try {
        body = (await request.json());
    }
    catch {
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
    const tableClient = (0, tables_1.getTableClient)("SupportMessages");
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
functions_1.app.http("supportMessage", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "support-message",
    handler: supportMessage,
});
//# sourceMappingURL=supportMessage.js.map