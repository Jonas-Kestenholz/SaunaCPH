import { TableClient } from "@azure/data-tables";

function getConnectionString(): string {
  const connectionString = process.env.AZURE_TABLES_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("Missing AZURE_TABLES_CONNECTION_STRING");
  }

  return connectionString;
}

export function getTableClient(tableName: string): TableClient {
  return TableClient.fromConnectionString(getConnectionString(), tableName);
}