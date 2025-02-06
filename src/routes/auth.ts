import type { App } from '@/types'
import { Hono } from 'hono'
import { AuthModel } from '@/models'
import { handleError } from '@/utils'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import bycrypt from 'bcryptjs'
import { zValidator } from '@hono/zod-validator'
import jwt from 'jsonwebtoken'
import { loginSchema } from '@/dtos'

const SECRET_KEY = 'fasdfljaslfali'
const TOKEN_EXPIRATION = '1h'
const app = new Hono<App>()

app.post(
  '/',
  zValidator('json', loginSchema, async (result, c) => {
    if (!result.success) {
      return c.json('invalid', 400)
    }
  }),
  async (c) => {
    const user = c.req.valid('json')
    const db = c.get('db')
    try {
      const userId = AuthModel.validateCredentials(db, {
        email: user.email,
        password: user.password,
      })

      return c.json(
        {
          ok: true,
          userId,
        },
        200,
      )
    } catch (error) {
      return handleError(error, c)
    }
  },
)

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
      const userFromDb = await AuthModel.login(db, user)
      const isValidPassword = await bycrypt.compare(user.password, userFromDb.password)

      console.log({ user, userFromDb, isValidPassword })
      if (!isValidPassword || userFromDb.email !== user.email) {
        return c.json({ ok: false }, 401)
      }
      const token = jwt.sign({ id: userFromDb.id, email: userFromDb.email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION })

      setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 3600,
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
