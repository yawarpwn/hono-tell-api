import type { customersTable, quotationsTable } from '../db/schemas'

import type { DrizzleD1Database } from 'drizzle-orm/d1'

export type DB = DrizzleD1Database<typeof schema>

type Bindings = {
  USERNAME: string
  PASSWORD: string
  JWT_SECRET: string
  TELLAPP_DB: D1Database
}

type Variables = {
  mam: number
  db: DB
  MY_VAR: string
}

type App = {
  Bindings: Bindings
  Variables: Variables
}

//SChemas
export type InsertCustomer = typeof customersTable.$inferInsert
export type InsertQuotation = typeof quotationsTable.$inferInsert
