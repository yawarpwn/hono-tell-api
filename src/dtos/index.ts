import { z } from 'zod'
import { customersTable, quotationsTable } from '@/db/schemas'
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const QuotationItemSchema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  unit_size: z.string(),
  description: z.string(),
})

export const QuotationClientSchema = z.object({
  number: z.number(),
  id: z.string(),
  includeIgv: z.coerce.boolean(),
  isRegularCustomer: z.coerce.boolean().default(false).optional().nullable(),
  isPaymentPending: z.coerce.boolean().default(false).optional().nullable(),
  customerId: z.string().optional().nullable(),
  ruc: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  deadline: z.coerce.number().gt(0, {
    message: 'Debe ser mayor a 0',
  }),
  items: z.array(QuotationItemSchema),
  credit: z.coerce.number().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
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
  items: () => z.array(QuotationItemSchema),
}).omit({
  id: true,
  number: true,
})
export const UpdateQuotationSchema = createUpdateSchema(quotationsTable, {
  items: () => z.array(ItemQuotationSchema),
})

export const ItemQuotationSchema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  unit_size: z.string(),
  description: z.string(),
})
