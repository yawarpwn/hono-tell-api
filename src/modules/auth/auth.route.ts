import type { App } from '@/types'
import { Hono } from 'hono'
import { AuthService } from './auth.service'
import { handleError } from '@/core/utils'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { jwt, verify, sign, decode } from 'hono/jwt'
import { loginSchema } from './auth.validation'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<App>()

app.get('/verify', async (c) => {
  const credentials = c.req.header('Authorization')

  let token: null | string = null
  if (credentials) {
    const parts = credentials.split(/\s+/)
    if (parts.length !== 2) {
      throw new HTTPException(401, {
        message: 'Invalid credentials',
      })
    } else {
      token = parts[1]
    }
  }

  console.log('[AUTH]: token: ', token)
  if (!token) {
    throw new HTTPException(401, {
      message: 'Credentials no included in request',
    })
  }

  let payload: any
  let cause: any

  try {
    payload = await verify(token, c.env.JWT_SECRET)
  } catch (error) {
    cause = error
  }

  if (!payload) {
    throw new HTTPException(401, {
      message: cause,
    })
  }

  return c.json(payload)
})

app.get('/', async (c) => {
  return c.json({ message: 'auth path' })
})

app.post(
  '/login',
  zValidator('json', loginSchema, async (result, c) => {
    if (!result.success) {
      return c.json({ message: 'Contraseña y correo son requeridos' }, 400)
    }
  }),
  async (c) => {
    const { password, email } = c.req.valid('json')
    const db = c.get('db')

    const user = await AuthService.validateCredentials(db, {
      password,
      email,
    })

    const accessToken = await sign(
      {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      c.env.JWT_SECRET,
    )

    const refreshToken = await sign(
      {
        userId: user.id,
      },
      c.env.JWT_SECRET,
    )

    // setCookie(c, 'auth_token', accessToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'lax',
    //   path: '/',
    //   maxAge: 60 * 60 * 24, // 1 day
    // })

    return c.json({
      accessToken,
      refreshToken,
      user,
    })
  },
)

app.post('/logout', async (c) => {
  // Agregar token a blacklist si usas una
  return c.json({
    message: 'Logout existoso',
  })
})

app.post('/refesh', async (c) => {
  const { refreshToken } = await c.req.json()

  //Verificar refreshToken
  const payload = await verify(refreshToken, c.env.JWT_SECRET)

  const newAccessToken = await sign(
    {
      id: payload.userId,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
    },
    c.env.JWT_SECRET,
  )

  return c.json({
    accessToken: newAccessToken,
  })
})

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
