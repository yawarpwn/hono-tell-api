import { z } from 'zod'

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

export type User = z.infer<typeof UserSchema>
export type Login = z.infer<typeof loginSchema>
