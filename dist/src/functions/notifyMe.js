"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyMe = notifyMe;
const functions_1 = require("@azure/functions");
const auth_1 = require("../shared/auth");
const tables_1 = require("../shared/tables");
function createSafeKey(value, fallback) {
    const safeValue = value.replace(/[^a-zA-Z0-9]/g, "").slice(-80);
    return safeValue.length > 0 ? safeValue : fallback;
}
function createSafeRowKey(customerId, expoPushToken) {
    const safeCustomerId = customerId
        ? createSafeKey(customerId, "anonymous")
        : "anonymous";
    const safeTokenPart = createSafeKey(expoPushToken, "token");
    return `${safeCustomerId}-${safeTokenPart}`;
}
async function notifyMe(request, context) {
    context.log(`Notify me request received: ${request.url}`);
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
    const tableClient = (0, tables_1.getTableClient)("NotifyMeRegistrations");
    await tableClient.createTable();
    const now = new Date().toISOString();
    const safeVariantPartitionKey = createSafeKey(variantId, "unknownVariant");
    await tableClient.upsertEntity({
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
    }, "Replace");
    context.log(`Notify me registration saved for variant ${variantId}`);
    return {
        status: 201,
        jsonBody: {
            ok: true,
            message: "Notify me registration saved",
        },
    };
}
functions_1.app.http("notifyMe", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "notify-me",
    handler: notifyMe,
});
//# sourceMappingURL=notifyMe.js.map