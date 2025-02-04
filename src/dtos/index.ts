import { z } from 'zod'
import { customersTable, quotationsTable, productsTable } from '@/db/schemas'
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const itemQuotationSChema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  unitSize: z.string(),
  description: z.string(),
})
//Users
const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.enum(['user', 'admin']),
})

export type UserDto = z.infer<typeof UserSchema>

// Customers
export const customerSchema = createSelectSchema(customersTable)
export const insertCustomerSchema = createInsertSchema(customersTable, {
  ruc: () => z.coerce.string().length(11),
  phone: () => z.coerce.string().length(9).nullable().optional(),
}).omit({
  id: true,
})
export const updateCustomerSchema = createUpdateSchema(customersTable)

//Quotations
export const quotationSchema = createSelectSchema(quotationsTable)
export const insertQuotationSchema = createInsertSchema(quotationsTable, {
  items: () => z.array(itemQuotationSChema),
}).omit({
  id: true,
  number: true,
  createdAt: true,
  updatedAt: true,
})
export const updateQuotationSchema = createUpdateSchema(quotationsTable, {
  items: () => z.array(itemQuotationSChema),
}).omit({
  createdAt: true,
  number: true,
  updatedAt: true,
  id: true,
})

//Products
export const productSchema = createSelectSchema(productsTable)
export const insertProductSchema = createInsertSchema(productsTable)
export const updateProductSchema = createUpdateSchema(productsTable)
