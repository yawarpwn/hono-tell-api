import { z } from 'zod'

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  ruc: z.string(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  isRegular: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const insertCustomerSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export const updateCustomerSchema = insertCustomerSchema.partial()

export type Customer = z.infer<typeof customerSchema>
export type CreateCustomer = z.infer<typeof insertCustomerSchema>
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>
