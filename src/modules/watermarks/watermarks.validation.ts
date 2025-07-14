import { z } from 'zod'
import { watermarksTable } from '@/core/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//-------------------------------------Watermark-----------------------------------\\
export const watermarkSchema = createSelectSchema(watermarksTable)
export const insertWatermarkSchema = createInsertSchema(watermarksTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateWatermarkSchema = insertWatermarkSchema.partial()

export type Watermark = z.infer<typeof watermarkSchema>
export type CreateWatermark = z.infer<typeof insertWatermarkSchema>
export type UpdateWatermark = z.infer<typeof updateWatermarkSchema>
