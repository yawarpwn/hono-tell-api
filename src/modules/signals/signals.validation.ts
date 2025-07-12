import { z } from 'zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable, signalsTable } from '@/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//-------------------------------------Signals-----------------------------------\\
export const signalSchema = createSelectSchema(signalsTable)
export const insertSignalSchema = createInsertSchema(signalsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateSignalSchema = insertSignalSchema.partial()
