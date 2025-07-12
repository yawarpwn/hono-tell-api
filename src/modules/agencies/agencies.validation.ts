import { z } from 'zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable, signalsTable } from '@/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//---------------------------------Agencies------------------------------------\\
export const agencySchema = createSelectSchema(agenciesTable)
export const insertAgencySchema = createInsertSchema(agenciesTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateAgencySchema = insertAgencySchema.partial()
