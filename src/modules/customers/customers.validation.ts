import { z } from 'zod'

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  ruc: z.string().regex(/^(20|10|15)[0-9]{9}$/, {
    message: 'Invalid RUC',
  }),
  phone: z
    .string()
    .regex(/^9\d{8}$/, {
      message: 'Phone number is invalid',
    })
    .nullish(),
  email: z.string().email().nullish(),
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

export const customerQueryParamsSchema = z.object({
  onlyRegular: z
    .string()
    .transform((val) => val === 'true')
    .optional()
    .default('false'),
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => {
      const num = parseInt(val)
      return Number.isNaN(num) || num < 1 ? 1 : num
    }),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => {
      const num = parseInt(val)
      return Number.isNaN(num) || num < 1 ? 10 : Math.min(num, 100) // Máximo 100 items por página
    }),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export type CustomerQueryParams = z.infer<typeof customerQueryParamsSchema>
