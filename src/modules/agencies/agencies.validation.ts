import type { z } from 'zod'
import { agenciesTable } from '@/core/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//---------------------------------Agencies------------------------------------\\
export const agencySchema = createSelectSchema(agenciesTable)
export const insertAgencySchema = createInsertSchema(agenciesTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateAgencySchema = insertAgencySchema.partial()

export type Agency = z.infer<typeof agencySchema>
export type CreateAgency = z.infer<typeof insertAgencySchema>
export type UpdateAgency = z.infer<typeof updateAgencySchema>
