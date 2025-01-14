import { z } from 'zod'
import { customersTable, quotationsTable } from '@/db/schemas'
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod'

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
export const InsertQuotationSchema = createInsertSchema(quotationsTable, {}).omit({
  id: true,
})
export const UpdateQuotationSchema = createUpdateSchema(quotationsTable)
export const ItemQuotationSchema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  unit_size: z.string(),
  description: z.string(),
})
