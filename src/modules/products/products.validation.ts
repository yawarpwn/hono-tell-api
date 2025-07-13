import { z } from 'zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable, signalsTable } from '@/core/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//---------------------------------Products------------------------------------\\
export const productSchema = createSelectSchema(productsTable)
export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateProductSchema = insertProductSchema.partial()
