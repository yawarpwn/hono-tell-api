import { z } from 'zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable, signalsTable } from '@/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//-------------------------------------Watermark-----------------------------------\\
export const watermarkSchema = createSelectSchema(watermarksTable)
export const insertWatermarkSchema = createInsertSchema(watermarksTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateWatermarkSchema = insertWatermarkSchema.partial()
