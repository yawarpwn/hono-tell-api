import type {
  customerSchema,
  insertCustomerSchema,
  insertProductSchema,
  insertQuotationSchema,
  itemQuotationSChema,
  loginSchema,
  productSchema,
  quotationSchema,
  updateCustomerSchema,
  updateProductSchema,
  updateQuotationSchema,
} from '@/dtos'
import type { customersTable, quotationsTable } from '../db/schemas'

import type { PRODUCT_CATEGORIES } from '@/constants'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { z } from 'zod'

export type DB = DrizzleD1Database

type Bindings = {
  USERNAME: string
  PASSWORD: string
  JWT_SECRET: string
  DB: D1Database
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
export type CustomerDto = z.infer<typeof customerSchema>
export type CreateCustomerDto = z.infer<typeof insertCustomerSchema>
export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>

//Quotations
export type QuotationDto = z.infer<typeof quotationSchema>
export type CreateQuotationDto = z.infer<typeof insertQuotationSchema>
export type UpdateQuotationDto = z.infer<typeof updateQuotationSchema>
export type ItemQuotation = z.infer<typeof itemQuotationSChema>

//Products
export type ProductDto = z.infer<typeof productSchema>
export type CreateProductDto = z.infer<typeof insertProductSchema>
export type UpdateProductDto = z.infer<typeof updateProductSchema>
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES]

//Authr
export type LoginDto = z.infer<typeof loginSchema>
