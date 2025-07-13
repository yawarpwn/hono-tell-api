import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import {
  customersTable,
  quotationsTable,
  productsTable,
  agenciesTable,
  labelsTable,
  watermarksTable,
  signalsTable,
} from '@/core/db/schemas'
import z from 'zod'

export const quotationSchema = createSelectSchema(quotationsTable)
export const insertQuotationSchema = createInsertSchema(quotationsTable, {
  items: () => z.array(itemQuotationSChema),
})
  .extend({
    customer: z
      .object({
        name: z.string(),
        ruc: z.string(),
        address: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
  })
  .omit({
    id: true,
    number: true,
    createdAt: true,
    updatedAt: true,
  })
export const updateQuotationSchema = insertQuotationSchema.partial()

export const itemQuotationSChema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  unitSize: z.string(),
  description: z.string(),
})
