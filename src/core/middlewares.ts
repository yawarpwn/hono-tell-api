import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'
import { drizzle } from 'drizzle-orm/d1'

export const authMiddleware = createMiddleware(async (c, next) => {
  const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET })
  return jwtMiddleware(c, next)
})

export const databaseMiddleware = createMiddleware(async (c, next) => {
  const db = drizzle(c.env.DB)
  // @ts-ignore
  c.set('db', db)
  return next()
})
