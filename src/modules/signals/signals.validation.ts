import type { z } from 'zod'
import { signalsTable } from '@/core/db/schemas'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

export const signalSchema = createSelectSchema(signalsTable)
export const insertSignalSchema = createInsertSchema(signalsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateSignalSchema = insertSignalSchema.partial()

export type Signal = z.infer<typeof signalSchema>
export type CreateSignal = z.infer<typeof insertSignalSchema>
export type UpdateSignal = z.infer<typeof updateSignalSchema>
