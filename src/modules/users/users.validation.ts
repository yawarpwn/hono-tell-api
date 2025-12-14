import type { z } from 'zod'
import { usersTable } from '@/core/db/schemas'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

//---------------------------------Agencies------------------------------------\\
export const userSchema = createSelectSchema(usersTable)
// export const insertUserSchema = createInsertSchema(userSchema).omit({
//   id: true,
// })
// export const updateUserSchema = insertUserSchema.partial()

export type User = z.infer<typeof userSchema>
// export type CreateUser = z.infer<typeof insertAgencySchema>
// export type UpdateUser = z.infer<typeof updateAgencySchema>
//
//
