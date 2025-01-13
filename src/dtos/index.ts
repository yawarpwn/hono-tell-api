import { customersTable } from '@/db/schemas'
import { z } from 'zod'
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod'

const TodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  complete: z.boolean(),
})

//todos schemas
export const CreateTodoSchema = TodoSchema.omit({ id: true })
export const UpdateTodoSchema = TodoSchema.partial().omit({ id: true })

//todos dtos
export type TodoDto = z.infer<typeof TodoSchema>
export type CreateTodoDto = z.infer<typeof CreateTodoSchema>
export type UpdateTodoDto = z.infer<typeof UpdateTodoSchema>

//Users
const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.enum(['user', 'admin']),
})

export type UserDto = z.infer<typeof UserSchema>

// Customers
export const CustomerSchema = createSelectSchema(customersTable)
export const InsertCustomerSchema = createInsertSchema(customersTable, {
  ruc: () => z.coerce.string().length(11),
  phone: () => z.coerce.string().length(9).nullable().optional(),
}).omit({
  id: true,
})
export const UpdateCustomerSchema = createUpdateSchema(customersTable)

export type CustomerDto = z.infer<typeof CustomerSchema>
export type CreateCustomerDto = z.infer<typeof InsertCustomerSchema>
export type UpdateCustomerDto = z.infer<typeof InsertCustomerSchema>
