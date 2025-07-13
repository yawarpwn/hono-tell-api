import { usersTable } from '@/core/db/schemas'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono/quick'
import type { App } from '@/types'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { AuthModel } from '@/models'

export const usersRoute = new Hono<App>()

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

usersRoute.post(
  '/register',
  zValidator('json', userSchema, async (result, c) => {
    if (!result.success) return c.json({ ok: false, message: 'invalid' }, 401)
  }),

  async (c) => {
    const user = c.req.valid('json')
    const db = c.get('db')

    //Validar si el correo ya esta registrado
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, user.email))
    if (existing.length > 0) return c.json({ ok: false, message: 'user already exists' }, 401)

    //ecriptar la contraseña
    const hashedPassword = await AuthModel.hashPassword(user.password)

    //guardar en base de datos
    const rows = await db.insert(usersTable).values({ email: user.email, password: hashedPassword })
    if (!rows.success) return c.json({ ok: false, message: 'error registering user' }, 401)

    return c.json({
      ok: true,
      message: 'user registered successfully',
    })
  },
)

usersRoute.post(
  '/change-password',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
      oldPassword: z.string().min(6),
      newPassword: z.string().min(6),
    }),
    async (result, c) => {
      console.log(result.data)
      if (!result.success) return c.json({ ok: false, message: 'invalid' }, 401)
    },
  ),
  async (c) => {
    const user = c.req.valid('json')
    const db = c.get('db')

    //Validar si el correo y contraseña son correctos
    const { email } = await AuthModel.validateCredentials(db, {
      email: user.email,
      password: user.oldPassword,
    })

    //ecriptar la contraseña
    const hashedPassword = await AuthModel.hashPassword(user.newPassword)

    //Actualizar en base datos
    const rows = await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.email, email))
    if (!rows.success) return c.json({ ok: false, message: 'error updating user' }, 401)

    return c.json({
      ok: true,
      message: 'user password updated successfully',
    })
  },
)
