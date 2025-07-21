import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type * as schema from '@/core/db/schemas'

export type DB = DrizzleD1Database<typeof schema>

type Bindings = {
  POSTGRES_URL: string
  JWT_SECRET: string
  TELL_API_KEY: string
  RESEND_API_KEY: string
  CLOUDINARY_API_SECRET: string
  DB: D1Database
}

type Variables = {
  db: DB
  MY_VAR: string
}

export type App = {
  Bindings: Bindings
  Variables: Variables
}
