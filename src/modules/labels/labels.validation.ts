import { z } from 'zod'
import { labelsTable } from '@/core/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

export const labelSchema = createSelectSchema(labelsTable)
export const insertLabelSchema = createInsertSchema(labelsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateLabelSchema = insertLabelSchema.partial()

export type Label = z.infer<typeof labelSchema>
export type UpdateLabel = z.infer<typeof updateLabelSchema>
export type CreateLabel = z.infer<typeof insertLabelSchema>
