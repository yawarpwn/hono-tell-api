import type {
  CustomerSchema,
  InsertCustomerSchema,
  InsertProductSchema,
  InsertQuotationSchema,
  ItemQuotationSchema,
  ProductSchema,
  QuotationSchema,
  UpdateCustomerSchema,
  UpdateProductSchema,
  UpdateQuotationSchema,
} from '@/dtos'
import type { customersTable, quotationsTable } from '../db/schemas'

import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { z } from 'zod'
import type { PRODUCT_CATEGORIES } from '@/constants'

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

//Customers
export type CustomerDto = z.infer<typeof CustomerSchema>
export type CreateCustomerDto = z.infer<typeof InsertCustomerSchema>
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>

//Quotations
export type QuotationDto = z.infer<typeof QuotationSchema>
export type CreateQuotationDto = z.infer<typeof InsertQuotationSchema>
export type UpdateQuotationDto = z.infer<typeof UpdateQuotationSchema>
export type ItemQuotation = z.infer<typeof ItemQuotationSchema>

//Products
export type ProductDto = z.infer<typeof ProductSchema>
export type CreateProductDto = z.infer<typeof InsertProductSchema>
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES]
