import { z } from 'zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable, signalsTable } from '@/core/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//----------------------------------Labels--------------------------------------\\
export const labelSchema = createSelectSchema(labelsTable)
export const insertLabelSchema = createInsertSchema(labelsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateLabelSchema = insertLabelSchema.partial()
