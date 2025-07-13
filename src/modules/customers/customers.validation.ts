import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { customersTable, quotationsTable, productsTable, agenciesTable, labelsTable, watermarksTable, signalsTable } from '@/core/db/schemas'
import { z } from 'zod'

//--------------------------------- Customers---------------------------------\\
export const customerSchema = createSelectSchema(customersTable)
export const insertCustomerSchema = createInsertSchema(customersTable, {
  ruc: () => z.coerce.string().length(11),
  phone: () => z.coerce.string().length(9).nullable().optional(),
}).omit({
  id: true,
})
export const updateCustomerSchema = insertCustomerSchema.partial()
