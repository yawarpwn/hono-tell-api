import { z } from 'zod'

//------------------------------------Users---------------------------------\\
const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum(['user', 'admin']),
  firstName: z.string(),
  lastName: z.string(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type User = z.infer<typeof UserSchema>
export type Login = z.infer<typeof loginSchema>
