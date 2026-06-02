"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = isAuthorized;
function isAuthorized(request) {
    const expectedApiKey = process.env.SAUNA_API_KEY;
    if (!expectedApiKey) {
        return false;
    }
    const providedApiKey = request.headers.get("x-api-key");
    return providedApiKey === expectedApiKey;
}
//# sourceMappingURL=auth.js.map