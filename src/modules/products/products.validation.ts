import { z } from 'zod'
import { productsTable } from '@/core/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//---------------------------------Products------------------------------------\\
export const productSchema = createSelectSchema(productsTable)
export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateProductSchema = insertProductSchema.partial()

export type Product = z.infer<typeof productSchema>
export type CreateProduct = z.infer<typeof insertProductSchema>
export type UpdateProduct = z.infer<typeof updateProductSchema>
