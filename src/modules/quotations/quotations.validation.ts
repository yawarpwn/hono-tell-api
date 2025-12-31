import { quotationsTable } from '@/core/db/schemas'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

export const quotationQueryParamsSchema = z.object({
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
      return Number.isNaN(num) || num < 1 ? 10 : num
    }),
  query: z.string().optional(),
})

export type QuotationQueryParams = z.infer<typeof quotationQueryParamsSchema>

export const itemQuotationSChema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  unitSize: z.string({ message: 'unidad y medidad es requerido' }),
  code: z.string().optional(),
  description: z.string(),
  productId: z.string().optional().nullable(),
  discount: z.number().optional().default(0),
})

export type QuotationItem = z.infer<typeof itemQuotationSChema>

export const quotationSchema = z.object({
  id: z.string(),
  number: z.number().positive(),
  credit: z.number().positive().optional().nullable(),
  includeIgv: z.boolean(),
  validityDays: z.number().positive().optional().nullable(),
  observations: z.string().optional().nullable(),
  standardTerms: z.array(z.string()),
  paymentCodition: z.enum(['ADVANCE_50', 'ADVANCE_20', 'ADVANCE_80', 'FULL_PREPAYMENT', 'CREDIT']),
  deadline: z
    .number({
      message: 'Fecha de entrega debe ser mayor a 0',
    })
    .positive({
      message: 'Fecha de entrega ser mayor a 0',
    }),
  isPaymentPending: z.boolean(),
  customerId: z.string().optional().nullable(),
  items: z.array(itemQuotationSChema),
  customer: z
    .object({
      name: z.string().optional().nullable(),
      ruc: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      isRegular: z.boolean().default(false),
    })
    .optional()
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// export const insertQuotationSchema = quotationSchema.omit({
//   id: true,
//   number: true,
//   createdAt: true,
//   updatedAt: true,
// })
//

export const insertQuotationSchema = createInsertSchema(quotationsTable, {
  items: z.array(itemQuotationSChema),
  deadline: z.number().positive(),
  standardTerms: z.array(z.enum(['DESIGNS_APPROVAL', 'PREPAID_SHIPPING', 'WARRANTY_3M', 'LAM_CHINA'])),
}).omit({
  id: true,
  number: true,
  updatedAt: true,
  createdAt: true,
})

export const updateQuotationSchema = insertQuotationSchema.partial()

export type Quotation = z.infer<typeof quotationSchema>
export type CreateQuotation = z.infer<typeof insertQuotationSchema>
export type UpdateQuotation = z.infer<typeof updateQuotationSchema>
