import { drizzle } from 'drizzle-orm/d1'

export function getD1Database(d1: D1Database) {
  return drizzle(d1)
}
