import type { App } from '@/types'
import { Hono } from 'hono'
import { AuthService } from './auth.service'
import { zValidator } from '@hono/zod-validator'
import { loginSchema } from './auth.validation'

const app = new Hono<App>()

app.post('/verify', async (c) => {
  const { accessToken } = await c.req.json()

  if (!accessToken) {
    return c.json(
      {
        success: false,
        message: 'Access token is required',
      },
      400,
    )
  }

  const decodedPayload = await AuthService.verifyToken(accessToken, c.env.JWT_SECRET)

  return c.json(decodedPayload)
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

    const { accessToken, refreshToken } = await AuthService.login(db, { email, password }, c.env.JWT_SECRET)

    return c.json({
      success: true,
      accessToken,
      refreshToken,
    })
  },
)

app.post('/logout', async (c) => {
  // Agregar token a blacklist si usas una
  return c.json({
    message: 'Logout existoso',
  })
})

app.post('/refresh', async (c) => {
  const { refreshToken } = await c.req.json()
  const db = c.get('db')

  const newAccessToken = await AuthService.refreshToken(db, refreshToken, c.env.JWT_SECRET)

  return c.json({
    accessToken: newAccessToken,
  })
})

export default app
