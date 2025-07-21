import z from 'zod'

export const itemQuotationSChema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  unitSize: z.string({ message: 'unidad y medidad es requerido' }),
  description: z.string(),
})

export const quotationSchema = z.object({
  id: z.string(),
  number: z.number().positive(),
  credit: z.number().positive().optional().nullable(),
  includeIgv: z.boolean(),
  validityDays: z.number().positive().optional().nullable(),
  observations: z.string().optional().nullable(),
  standardTerms: z.array(z.string()),
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

export const insertQuotationSchema = quotationSchema.omit({
  id: true,
  number: true,
  createdAt: true,
  updatedAt: true,
})

export const updateQuotationSchema = insertQuotationSchema.partial()

export type Quotation = z.infer<typeof quotationSchema>
export type CreateQuotation = z.infer<typeof insertQuotationSchema>
export type UpdateQuotation = z.infer<typeof updateQuotationSchema>
