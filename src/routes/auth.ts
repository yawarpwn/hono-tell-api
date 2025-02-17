import type { App } from '@/types'
import { Hono } from 'hono'
import { AuthModel } from '@/models'
import { handleError } from '@/utils'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { jwt, verify, sign } from 'hono/jwt'
import { loginSchema } from '@/dtos'

const app = new Hono<App>()

app.get('/', async (c) => {
  return c.json({ message: 'auth path' })
})

app.post(
  '/login',
  zValidator('json', loginSchema, async (result, c) => {
    if (!result.success) {
      return c.json('invalid', 400)
    }
  }),
  async (c) => {
    const user = c.req.valid('json')
    const db = c.get('db')

    try {
      const { email, id } = await AuthModel.validateCredentials(db, user)
      const token = await sign({ id, email }, c.env.JWT_SECRET)

      setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })

      return c.json({
        token,
      })
    } catch (error) {
      return handleError(error, c)
    }
  },
)

export { app as authRoute }
