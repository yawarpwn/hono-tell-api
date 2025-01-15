import type { customersTable, quotationsTable } from '../db/schemas'
import type {
  InsertCustomerSchema,
  InsertQuotationSchema,
  UpdateQuotationSchema,
  ItemQuotationSchema,
  CustomerSchema,
  QuotationSchema,
} from '@/dtos'

import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { z } from 'zod'

export type DB = DrizzleD1Database

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

export type App = {
  Bindings: Bindings
  Variables: Variables
}

//SChemas
export type InsertCustomer = typeof customersTable.$inferInsert
export type InsertQuotation = typeof quotationsTable.$inferInsert

export type CustomerDto = z.infer<typeof CustomerSchema>
export type CreateCustomerDto = z.infer<typeof InsertCustomerSchema>
export type UpdateCustomerDto = z.infer<typeof InsertCustomerSchema>

export type QuotationDto = z.infer<typeof QuotationSchema>
export type CreateQuotationDto = z.infer<typeof InsertQuotationSchema>
export type UpdateQuotationDto = z.infer<typeof UpdateQuotationSchema>
export type ItemQuotation = z.infer<typeof ItemQuotationSchema>
