import type { App } from '@/types'
import { Hono } from 'hono'
import { AuthModel } from '@/models'
import { handleError } from '@/utils'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import bycrypt from 'bcryptjs'
import { zValidator } from '@hono/zod-validator'
import jwt from 'jsonwebtoken'
import { loginSchema } from '@/dtos'
import { HTTPException } from 'hono/http-exception'

const SECRET_KEY = 'KAKA'
const TOKEN_EXPIRATION = '1h'

const app = new Hono<App>()

app.post(
  '/login',
  zValidator('json', loginSchema, (result, c) => {
    if (!result.success) return c.json('invalid', 400)
  }),
  async (c) => {
    const user = c.req.valid('json')
    const db = c.get('db')

    try {
      const userFromDb = await AuthModel.login(db, user)

      //valid password
      const isValidPassword = await bycrypt.compare(user.password, userFromDb.password)
      if (!isValidPassword)
        throw new HTTPException(401, {
          message: 'Invalid password',
        })

      const token = jwt.sign({ id: userFromDb.id, email: userFromDb.email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION })
      setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600,
      })

      return c.json({
        id: userFromDb.id,
        email: userFromDb.email,
        role: userFromDb.role,
      })
    } catch (error) {
      return handleError(error, c)
    }
  },
)

export { app as authRoute }
