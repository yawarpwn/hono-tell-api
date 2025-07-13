import type { App } from '@/types'
import { Hono } from 'hono'
import { AuthService } from './auth.service'
import { handleError } from '@/utils'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { jwt, verify, sign } from 'hono/jwt'
import { loginSchema } from '@/dtos'
import { z } from 'zod'

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
      const { email, id } = await AuthService.validateCredentials(db, user)
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

app.post(
  '/reset-password',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
      newPassword: z.string().min(6),
      tell_api_key: z.string(),
    }),
  ),
  async (c) => {
    try {
      const json = c.req.valid('json')
      const db = c.get('db')

      //validate token
      const isAuthorized = json.tell_api_key === c.env.TELL_API_KEY
      if (!isAuthorized) return c.json({ message: 'Unauthorized' }, 401)

      await AuthService.resetPassword(db, json.email, json.newPassword)
      return c.json({ message: 'reset password' })
    } catch (error) {
      return handleError(error, c)
    }
  },
)

export default app
