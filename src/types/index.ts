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
  agencySchema,
  insertAgencySchema,
  updateAgencySchema,
  insertLabelSchema,
  labelSchema,
  updateLabelSchema,
} from '@/dtos'
import type { customersTable, quotationsTable } from '../db/schemas'

import type { PRODUCT_CATEGORIES } from '@/constants'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { z } from 'zod'

export type DB = DrizzleD1Database

type Bindings = {
  POSTGRES_URL: string
  JWT_SECRET: string
  DB: D1Database
}

type Variables = {
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

//Agencies
export type AgencyDto = z.infer<typeof agencySchema>
export type CreateAgencyDto = z.infer<typeof insertAgencySchema>
export type UpdateAgencyDto = z.infer<typeof updateAgencySchema>

//Labels
export type LabelDto = z.infer<typeof labelSchema>
export type CreateLabelDto = z.infer<typeof insertLabelSchema>
export type UpdateLabelDto = z.infer<typeof updateLabelSchema>

//Authr
export type LoginDto = z.infer<typeof loginSchema>
