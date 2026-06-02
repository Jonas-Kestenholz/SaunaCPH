"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableClient = getTableClient;
const data_tables_1 = require("@azure/data-tables");
function getConnectionString() {
    const connectionString = process.env.AZURE_TABLES_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Missing AZURE_TABLES_CONNECTION_STRING");
    }
    return connectionString;
}
function getTableClient(tableName) {
    return data_tables_1.TableClient.fromConnectionString(getConnectionString(), tableName);
}
//# sourceMappingURL=tables.js.map