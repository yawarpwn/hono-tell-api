import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
// Disable prefetch as it is not supported for "Transaction" pool mode

export function getPostgresDatabase(connectionString: string) {
  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)
  return db
}
