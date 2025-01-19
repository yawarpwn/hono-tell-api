import { z } from 'zod'
import { customersTable, quotationsTable, productsTable } from '@/db/schemas'
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const ItemQuotationSchema = z.object({
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
export const CustomerSchema = createSelectSchema(customersTable)
export const InsertCustomerSchema = createInsertSchema(customersTable, {
  ruc: () => z.coerce.string().length(11),
  phone: () => z.coerce.string().length(9).nullable().optional(),
}).omit({
  id: true,
})
export const UpdateCustomerSchema = createUpdateSchema(customersTable)

//Quotations
export const QuotationSchema = createSelectSchema(quotationsTable)
export const InsertQuotationSchema = createInsertSchema(quotationsTable, {
  items: () => z.array(ItemQuotationSchema),
}).omit({
  id: true,
  number: true,
})
export const UpdateQuotationSchema = createUpdateSchema(quotationsTable, {
  items: () => z.array(ItemQuotationSchema),
})

//Products
export const ProductSchema = createSelectSchema(productsTable)
export const InsertProductSchema = createInsertSchema(productsTable)
export const UpdateProductSchema = createUpdateSchema(productsTable)
