import { z } from 'zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable } from '@/db/schemas'

import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const itemQuotationSChema = z.object({
  id: z.string(),
  price: z.number(),
  qty: z.number(),
  cost: z.number().optional().nullable(),
  link: z.string().optional().nullable(),
  unitSize: z.string(),
  description: z.string(),
})
//------------------------------------Users---------------------------------\\
const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.enum(['user', 'admin']),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type UserDto = z.infer<typeof UserSchema>

//--------------------------------- Customers---------------------------------\\
export const customerSchema = createSelectSchema(customersTable)
export const insertCustomerSchema = createInsertSchema(customersTable, {
  ruc: () => z.coerce.string().length(11),
  phone: () => z.coerce.string().length(9).nullable().optional(),
}).omit({
  id: true,
})
export const updateCustomerSchema = createUpdateSchema(customersTable).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

//---------------------------------Quotations---------------------------------\\
export const quotationSchema = createSelectSchema(quotationsTable)
export const insertQuotationSchema = createInsertSchema(quotationsTable, {
  items: () => z.array(itemQuotationSChema),
}).omit({
  id: true,
  number: true,
  createdAt: true,
  updatedAt: true,
})
export const updateQuotationSchema = createUpdateSchema(quotationsTable, {
  items: () => z.array(itemQuotationSChema),
}).omit({
  createdAt: true,
  number: true,
  updatedAt: true,
  id: true,
})

//---------------------------------Products------------------------------------\\
export const productSchema = createSelectSchema(productsTable)
export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateProductSchema = createUpdateSchema(productsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})

//---------------------------------Agencies------------------------------------\\
export const agencySchema = createSelectSchema(agenciesTable)
export const insertAgencySchema = createInsertSchema(agenciesTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateAgencySchema = createUpdateSchema(agenciesTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})

//----------------------------------Labels--------------------------------------\\
export const labelSchema = createSelectSchema(labelsTable)
export const insertLabelSchema = createInsertSchema(labelsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateLabelSchema = createUpdateSchema(labelsTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})

//-------------------------------------Watermark-----------------------------------\\
export const watermarkSchema = createSelectSchema(watermarksTable)
export const insertWatermarkSchema = createInsertSchema(watermarksTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
export const updateWatermarkSchema = createUpdateSchema(watermarksTable).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
})
