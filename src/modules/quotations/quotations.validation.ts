import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable, signalsTable } from '@/core/db/schemas'
import z from 'zod'
import { itemQuotationSChema } from '@/dtos'

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
